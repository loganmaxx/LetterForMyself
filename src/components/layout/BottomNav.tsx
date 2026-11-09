import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, BookOpen, Plus, BarChart3, Wind } from 'lucide-react-native';
import { Language, MainView } from '../../types';
import { PALETTE, FONTS } from '../../constants/theme';
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
        {tabs.map((tab) => {
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
                <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
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
                    ? 'rgba(255, 255, 255, 0.45)'
                    : 'rgba(255, 255, 255, 0.65)'
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                  isNight && !isActive && { color: 'rgba(255, 255, 255, 0.45)' },
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
    shadowColor: '#172722',
    shadowOpacity: 0.28,
    shadowRadius: 14,
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
    fontFamily: FONTS.sansMedium,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  actionBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: PALETTE.terracotta,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PALETTE.terracotta,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
});
