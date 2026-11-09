import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, BookOpen, Plus, BarChart3, Wind } from 'lucide-react-native';
import { Language, MainView } from '../../types';
import { PALETTE } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';

interface BottomNavProps {
  currentView: MainView;
  language: Language;
  nightMode: boolean;
  onSelectView: (view: MainView) => void;
  onOpenWrite: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  language,
  nightMode,
  onSelectView,
  onOpenWrite,
}) => {
  const isNight = nightMode;

  const tabs = [
    { id: 'home' as MainView, label: language === 'id' ? 'Beranda' : 'Home', icon: Home },
    { id: 'notebook' as MainView, label: language === 'id' ? 'Jurnal' : 'Notebook', icon: BookOpen },
    { id: 'write' as const, isAction: true },
    { id: 'insights' as MainView, label: language === 'id' ? 'Wawasan' : 'Insights', icon: BarChart3 },
    { id: 'sanctuary' as MainView, label: language === 'id' ? 'Napas' : 'Breath', icon: Wind },
  ];

  return (
    <View style={styles.dockContainer}>
      <View style={[styles.dock, isNight && styles.nightDock]}>
        {tabs.map((tab, idx) => {
          if (tab.isAction) {
            return (
              <TouchableOpacity
                key="write-action"
                style={styles.actionBtn}
                onPress={() => {
                  HapticsService.medium();
                  onOpenWrite();
                }}
                activeOpacity={0.85}
              >
                <Plus size={24} color="#FFFFFF" />
              </TouchableOpacity>
            );
          }

          const IconComponent = tab.icon!;
          const isActive = currentView === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabBtn}
              onPress={() => {
                HapticsService.selection();
                onSelectView(tab.id);
              }}
              activeOpacity={0.7}
            >
              <IconComponent
                size={18}
                color={
                  isActive
                    ? '#FFFFFF'
                    : isNight
                    ? 'rgba(255, 255, 255, 0.5)'
                    : 'rgba(255, 255, 255, 0.65)'
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                  isNight && !isActive && { color: 'rgba(255, 255, 255, 0.5)' },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dockContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  dock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#263F36',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  nightDock: {
    backgroundColor: '#1C2722',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  tabBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 50,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B85330',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#B85330',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
});
