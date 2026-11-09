import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, BookOpen, Plus, CalendarHeart, Wind } from 'lucide-react-native';
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

  const leftTabs = [
    {
      id: 'home' as MainView,
      label: language === 'en' ? 'Home' : 'Beranda',
      icon: Home,
    },
    {
      id: 'notebook' as MainView,
      label: language === 'en' ? 'Journal' : 'Jurnal',
      icon: BookOpen,
    },
  ];

  const rightTabs = [
    {
      id: 'insights' as MainView,
      label: language === 'en' ? 'History' : 'Riwayat',
      icon: CalendarHeart,
    },
    {
      id: 'sanctuary' as MainView,
      label: language === 'en' ? 'Calm' : 'Tenang',
      icon: Wind,
    },
  ];

  const renderTab = (tab: { id: MainView; label: string; icon: any }) => {
    const IconComponent = tab.icon;
    const isActive = currentView === tab.id;

    return (
      <TouchableOpacity
        key={tab.id}
        style={[styles.tabPill, isActive && styles.tabPillActive]}
        onPress={() => {
          HapticsService.selection();
          onSelectView(tab.id);
        }}
        activeOpacity={0.75}
      >
        <IconComponent
          size={16}
          color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)'}
          strokeWidth={isActive ? 2.2 : 1.8}
        />
        <Text
          style={[
            styles.tabText,
            isActive && styles.tabTextActive,
            !isActive && styles.tabTextInactive,
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.dockContainer} pointerEvents="box-none">
      <View style={[styles.dock, isNight && styles.nightDock]}>
        {/* Left Tabs */}
        {leftTabs.map(renderTab)}

        {/* Center Floating Write Pill */}
        <TouchableOpacity
          style={styles.centerBtn}
          onPress={() => {
            HapticsService.medium();
            onOpenWrite();
          }}
          activeOpacity={0.85}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.4} />
        </TouchableOpacity>

        {/* Right Tabs */}
        {rightTabs.map(renderTab)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dockContainer: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 40,
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F332C',
    borderRadius: 36,
    paddingVertical: 5,
    paddingHorizontal: 6,
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  nightDock: {
    backgroundColor: '#16231E',
    borderColor: 'rgba(255, 255, 255, 0.09)',
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 9,
    borderRadius: 20,
  },
  tabPillActive: {
    backgroundColor: '#2F4F43',
    paddingHorizontal: 11,
  },
  tabText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansSemiBold,
  },
  tabTextInactive: {
    // Keep visible or subtle
    color: 'rgba(255, 255, 255, 0.65)',
  },
  centerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: PALETTE.terracotta,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    shadowColor: PALETTE.terracotta,
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
});
