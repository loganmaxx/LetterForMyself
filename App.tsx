import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Sun, Feather } from 'lucide-react-native';
import {
  JournalEntry,
  Language,
  MainView,
  MoodCheckIn,
  MoodType,
  TemplateType,
  UserSettings,
} from './src/types';
import { StorageService } from './src/services/storageService';
import { PALETTE } from './src/constants/theme';
import { HapticsService } from './src/services/hapticsService';
import { HomeView } from './src/components/home/HomeView';
import { NotebookView } from './src/components/journal/NotebookView';
import { InsightsView } from './src/components/insights/InsightsView';
import { MindfulPause } from './src/components/companion/MindfulPause';
import { JournalStudio } from './src/components/journal/JournalStudio';
import { JournalReader } from './src/components/journal/JournalReader';
import { MoodPickerModal } from './src/components/modals/MoodPickerModal';
import { BottomNav } from './src/components/layout/BottomNav';

export default function App() {
  const [settings, setSettings] = useState<UserSettings>({
    name: 'Traveler',
    language: 'id',
    defaultPaper: 'parchment',
    defaultFont: 'serif',
    nightMode: false,
    pinEnabled: false,
    pinCode: '',
    streakDays: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    botanicalPoints: 80,
  });
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [moods, setMoods] = useState<MoodCheckIn[]>([]);
  const [currentView, setCurrentView] = useState<MainView>('home');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [readingEntry, setReadingEntry] = useState<JournalEntry | null>(null);
  const [studioPrompt, setStudioPrompt] = useState<string | undefined>(undefined);
  const [studioTemplate, setStudioTemplate] = useState<TemplateType>('freeflow');
  const [moodPickerVisible, setMoodPickerVisible] = useState(false);

  // Load offline data from AsyncStorage
  useEffect(() => {
    (async () => {
      const s = await StorageService.getSettings();
      const j = await StorageService.getJournals();
      const m = await StorageService.getMoods();
      setSettings(s);
      setJournals(j);
      setMoods(m);
    })();
  }, []);

  // Hardware Back Button Handler for Android
  useEffect(() => {
    const onBackPress = () => {
      if (moodPickerVisible) {
        setMoodPickerVisible(false);
        return true;
      }
      if (currentView === 'write' || currentView === 'read') {
        setEditingEntry(null);
        setReadingEntry(null);
        setCurrentView('home');
        return true;
      }
      if (currentView !== 'home') {
        setCurrentView('home');
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [currentView, moodPickerVisible]);

  const toggleNightMode = () => {
    HapticsService.light();
    setSettings((prev) => {
      const updated = { ...prev, nightMode: !prev.nightMode };
      StorageService.saveSettings(updated);
      return updated;
    });
  };

  const toggleLanguage = () => {
    HapticsService.light();
    setSettings((prev) => {
      const updated: UserSettings = {
        ...prev,
        language: prev.language === 'id' ? 'en' : 'id',
      };
      StorageService.saveSettings(updated);
      return updated;
    });
  };

  const handleSaveJournal = (
    entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const nowIso = new Date().toISOString();
    let updatedList: JournalEntry[];

    if (editingEntry) {
      updatedList = journals.map((j) =>
        j.id === editingEntry.id
          ? { ...j, ...entryData, updatedAt: nowIso }
          : j
      );
      setEditingEntry(null);
    } else {
      const newEntry: JournalEntry = {
        ...entryData,
        id: `entry-${Date.now()}`,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      updatedList = [newEntry, ...journals];
    }

    setJournals(updatedList);
    StorageService.saveJournals(updatedList);
    setCurrentView('notebook');
  };

  const handleDeleteJournal = (id: string) => {
    const updated = journals.filter((j) => j.id !== id);
    setJournals(updated);
    StorageService.saveJournals(updated);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = journals.map((j) =>
      j.id === id ? { ...j, isFavorite: !j.isFavorite } : j
    );
    setJournals(updated);
    StorageService.saveJournals(updated);
    if (readingEntry && readingEntry.id === id) {
      setReadingEntry((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  const handleQuickMood = (mood: MoodType) => {
    const newMood: MoodCheckIn = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mood,
      emotions: [mood],
      note: 'Quick check-in',
    };
    const updated = [newMood, ...moods];
    setMoods(updated);
    StorageService.saveMoods(updated);
  };

  const handleFullMoodLog = (mood: MoodType, note: string) => {
    const newMood: MoodCheckIn = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mood,
      emotions: [mood],
      note,
    };
    const updated = [newMood, ...moods];
    setMoods(updated);
    StorageService.saveMoods(updated);
  };

  const handleOpenWrite = (tpl: TemplateType = 'freeflow', prompt?: string) => {
    setEditingEntry(null);
    setStudioTemplate(tpl);
    setStudioPrompt(prompt);
    setCurrentView('write');
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setReadingEntry(null);
    setEditingEntry(entry);
    setStudioTemplate(entry.template);
    setCurrentView('write');
  };

  const isNight = !!settings.nightMode;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.safeArea, isNight && { backgroundColor: PALETTE.nightBg }]}
        edges={['top', 'left', 'right']}
      >
        <StatusBar style={isNight ? 'light' : 'dark'} />

        {/* Top Botanical Brand Header (Shown on standard views) */}
        {currentView !== 'write' && currentView !== 'read' && (
          <View style={[styles.topHeader, isNight && styles.nightTopHeader]}>
            <TouchableOpacity
              style={styles.brandRow}
              onPress={() => setCurrentView('home')}
              activeOpacity={0.8}
            >
              <View style={styles.brandIconBox}>
                <Feather size={16} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.brandName, isNight && { color: PALETTE.nightInk }]}>
                  LetterForMyself
                </Text>
                <Text style={styles.brandTagline}>Mindful Sanctuary</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.headerPill, isNight && styles.nightHeaderPill]}
                onPress={toggleLanguage}
              >
                <Text style={[styles.headerPillText, isNight && { color: PALETTE.nightInk }]}>
                  {settings.language.toUpperCase()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.headerIconBtn, isNight && styles.nightHeaderPill]}
                onPress={toggleNightMode}
              >
                {isNight ? (
                  <Sun size={16} color="#F4A261" />
                ) : (
                  <Moon size={16} color={PALETTE.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* View Switcher */}
        <View style={styles.mainContent}>
          {currentView === 'home' && (
            <HomeView
              language={settings.language}
              nightMode={isNight}
              journals={journals}
              moods={moods}
              onOpenWrite={handleOpenWrite}
              onOpenReader={(entry) => {
                setReadingEntry(entry);
                setCurrentView('read');
              }}
              onQuickMood={handleQuickMood}
              onOpenAllMoods={() => setMoodPickerVisible(true)}
              onGoToNotebook={() => setCurrentView('notebook')}
            />
          )}

          {currentView === 'notebook' && (
            <NotebookView
              language={settings.language}
              nightMode={isNight}
              journals={journals}
              onOpenWrite={() => handleOpenWrite()}
              onOpenReader={(entry) => {
                setReadingEntry(entry);
                setCurrentView('read');
              }}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {currentView === 'insights' && (
            <InsightsView
              language={settings.language}
              nightMode={isNight}
              journals={journals}
              moods={moods}
            />
          )}

          {currentView === 'sanctuary' && (
            <MindfulPause language={settings.language} nightMode={isNight} />
          )}

          {currentView === 'write' && (
            <JournalStudio
              language={settings.language}
              nightMode={isNight}
              initialTemplate={studioTemplate}
              initialPrompt={studioPrompt}
              editingEntry={editingEntry}
              onSave={handleSaveJournal}
              onCancel={() => {
                setEditingEntry(null);
                setCurrentView('home');
              }}
            />
          )}

          {currentView === 'read' && readingEntry && (
            <JournalReader
              language={settings.language}
              nightMode={isNight}
              entry={readingEntry}
              onClose={() => {
                setReadingEntry(null);
                setCurrentView('notebook');
              }}
              onEdit={handleEditEntry}
              onDelete={handleDeleteJournal}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </View>

        {/* Floating Botanical Bottom Dock (hidden in write/read studios) */}
        {currentView !== 'write' && currentView !== 'read' && (
          <BottomNav
            currentView={currentView}
            language={settings.language}
            nightMode={isNight}
            onSelectView={setCurrentView}
            onOpenWrite={() => handleOpenWrite()}
          />
        )}

        {/* 20 Emotion Modal */}
        <MoodPickerModal
          visible={moodPickerVisible}
          language={settings.language}
          nightMode={isNight}
          onClose={() => setMoodPickerVisible(false)}
          onSelectMood={handleFullMoodLog}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.bg,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: PALETTE.bg,
  },
  nightTopHeader: {
    backgroundColor: PALETTE.nightBg,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#2D5A47',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.ink,
  },
  brandTagline: {
    fontSize: 9,
    color: PALETTE.inkMuted,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerPill: {
    backgroundColor: '#E8E0D2',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  nightHeaderPill: {
    backgroundColor: PALETTE.nightCardSecondary,
  },
  headerPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: PALETTE.ink,
  },
  headerIconBtn: {
    backgroundColor: '#E8E0D2',
    padding: 6,
    borderRadius: 10,
  },
  mainContent: {
    flex: 1,
  },
});
