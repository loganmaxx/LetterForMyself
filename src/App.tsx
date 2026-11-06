import React, { useState, useEffect } from 'react';
import type {
  JournalEntry,
  Language,
  MainView,
  MoodCheckIn,
  MoodType,
  TemplateType,
  UserSettings,
} from './types';
import { StorageService } from './services/storageService';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNavDock } from './components/layout/BottomNavDock';
import { SanctuaryHomeView } from './components/home/SanctuaryHomeView';
import { NotebookShelfView } from './components/journal/NotebookShelfView';
import { CalendarAndInsightsView } from './components/insights/CalendarAndInsightsView';
import { MindfulPauseView } from './components/companion/MindfulPauseView';
import { JournalStudioModal } from './components/journal/JournalStudioModal';
import { JournalReaderModal } from './components/journal/JournalReaderModal';
import { MoodCheckInModal } from './components/modals/MoodCheckInModal';
import { SettingsBackupModal } from './components/modals/SettingsBackupModal';
import { PinLockModal } from './components/modals/PinLockModal';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(() =>
    StorageService.getSettings()
  );
  const [journals, setJournals] = useState<JournalEntry[]>(() =>
    StorageService.getJournals()
  );
  const [moods, setMoods] = useState<MoodCheckIn[]>(() =>
    StorageService.getMoods()
  );

  // Navigation & Lock State
  const [currentView, setCurrentView] = useState<MainView>('home');
  const [returnView, setReturnView] = useState<MainView>('home');
  const [isLocked, setIsLocked] = useState<boolean>(
    () => !!settings.pinEnabled && settings.pinCode.length === 4
  );

  // Studio Page & Modals State
  const [studioTemplate, setStudioTemplate] = useState<TemplateType>('freeflow');
  const [studioPrompt, setStudioPrompt] = useState<string | undefined>(undefined);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [studioSessionKey, setStudioSessionKey] = useState<number>(0);
  const [readingEntry, setReadingEntry] = useState<JournalEntry | null>(null);
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync with LocalStorage & Cozy Night Mode class
  useEffect(() => {
    StorageService.saveSettings(settings);
    document.documentElement.classList.toggle('dark', !!settings.nightMode);
    document.body.classList.toggle('night-sanctuary', !!settings.nightMode);
  }, [settings]);

  useEffect(() => {
    StorageService.saveJournals(journals);
  }, [journals]);

  useEffect(() => {
    StorageService.saveMoods(moods);
  }, [moods]);

  // Native Android Hardware Back Button (popstate) & Laptop Escape Key navigation
  useEffect(() => {
    const goBackSafely = () => {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
        return true;
      }
      if (isMoodModalOpen) {
        setIsMoodModalOpen(false);
        return true;
      }
      if (currentView === 'read' || currentView === 'write') {
        setEditingEntry(null);
        setReadingEntry(null);
        setCurrentView(
          returnView === 'write' || returnView === 'read' ? 'home' : returnView
        );
        return true;
      }
      if (currentView !== 'home') {
        setCurrentView('home');
        return true;
      }
      return false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        goBackSafely();
      }
    };

    const handlePopState = () => {
      if (goBackSafely()) {
        window.history.pushState({ view: 'sanctuary' }, '');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentView, returnView, isSettingsOpen, isMoodModalOpen]);

  // Push history state when opening sub-views/modals so Android Back button triggers popstate
  useEffect(() => {
    if (currentView !== 'home' || isSettingsOpen || isMoodModalOpen) {
      window.history.pushState({ view: currentView }, '');
    }
  }, [currentView, isSettingsOpen, isMoodModalOpen]);

  const addBotanicalPoints = (pts: number) => {
    setSettings((prev) => ({
      ...prev,
      botanicalPoints: prev.botanicalPoints + pts,
    }));
  };

  // Language Toggle
  const handleToggleLanguage = (lang: Language) => {
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  // Cozy Night Mode Toggle
  const handleToggleNightMode = () => {
    setSettings((prev) => ({ ...prev, nightMode: !prev.nightMode }));
  };

  // Navigate to Full-Page Reader to read an existing entry
  const handleOpenReader = (entry: JournalEntry) => {
    if (currentView !== 'read' && currentView !== 'write') {
      setReturnView(currentView);
    }
    setReadingEntry(entry);
    setCurrentView('read');
  };

  // Navigate to Full-Page Write Studio with specific template
  const handleOpenWriteWithTemplate = (
    tpl: TemplateType = 'freeflow',
    promptText?: string
  ) => {
    if (currentView !== 'write' && currentView !== 'read') {
      setReturnView(currentView);
    }
    setEditingEntry(null);
    setStudioTemplate(tpl);
    setStudioPrompt(promptText);
    setStudioSessionKey((k) => k + 1);
    setCurrentView('write');
  };

  // Navigate to Full-Page Write Studio to edit an existing entry
  const handleEditJournalEntry = (entry: JournalEntry) => {
    if (currentView !== 'write' && currentView !== 'read') {
      setReturnView(currentView);
    }
    setReadingEntry(null);
    setEditingEntry(entry);
    setStudioTemplate(entry.template);
    setStudioSessionKey((k) => k + 1);
    setCurrentView('write');
  };

  // Save or Update Journal Page
  const handleSaveJournal = (
    entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const nowIso = new Date().toISOString();
    if (editingEntry) {
      const updatedList = journals.map((j) =>
        j.id === editingEntry.id
          ? { ...j, ...entryData, updatedAt: nowIso }
          : j
      );
      setJournals(updatedList);
      setEditingEntry(null);
    } else {
      const newEntry: JournalEntry = {
        ...entryData,
        id: `page-${Date.now()}`,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setJournals((prev) => [newEntry, ...prev]);
      addBotanicalPoints(entryData.template === 'cbt' ? 25 : 20);
    }
    setCurrentView('notebook');
  };

  const handleDeleteJournal = (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setJournals((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isFavorite: !j.isFavorite } : j))
    );
    if (readingEntry && readingEntry.id === id) {
      setReadingEntry((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  const handleUnlockCapsule = (id: string, reflection?: string) => {
    setJournals((prev) =>
      prev.map((j) =>
        j.id === id
          ? {
              ...j,
              isUnlocked: true,
              reflectionAfterOpening:
                reflection !== undefined
                  ? reflection
                  : j.reflectionAfterOpening,
            }
          : j
      )
    );
    if (readingEntry && readingEntry.id === id) {
      setReadingEntry((prev) =>
        prev
          ? {
              ...prev,
              isUnlocked: true,
              reflectionAfterOpening:
                reflection !== undefined
                  ? reflection
                  : prev.reflectionAfterOpening,
            }
          : null
      );
    }
  };

  // Mood Actions
  const handleQuickMoodLog = (mood: MoodType) => {
    const newMood: MoodCheckIn = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mood,
      emotions:
        mood === 'radiant' || mood === 'peaceful'
          ? ['grateful', 'content']
          : mood === 'grounded'
          ? ['curious']
          : ['tired'],
      bodySensations:
        mood === 'peaceful' || mood === 'radiant'
          ? ['calm_breath']
          : ['heavy_shoulders'],
      energyLevel: mood === 'radiant' ? 5 : mood === 'peaceful' ? 4 : 3,
      sleepQuality: 4,
      note:
        settings.language === 'en'
          ? 'Quick inner weather check-in'
          : 'Catatan cepat cuaca batin',
    };
    setMoods((prev) => [newMood, ...prev]);
    addBotanicalPoints(10);
  };

  const handleSaveFullMood = (
    data: Omit<MoodCheckIn, 'id' | 'timestamp'>
  ) => {
    const newMood: MoodCheckIn = {
      ...data,
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setMoods((prev) => [newMood, ...prev]);
    addBotanicalPoints(15);
  };

  const handleDeleteMood = (id: string) => {
    setMoods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDataRestored = () => {
    setSettings(StorageService.getSettings());
    setJournals(StorageService.getJournals());
    setMoods(StorageService.getMoods());
  };

  if (isLocked && settings.pinEnabled && settings.pinCode) {
    return (
      <PinLockModal
        expectedPin={settings.pinCode}
        language={settings.language}
        onUnlock={() => setIsLocked(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper-bg text-ink-900 pb-24">
      {/* Top Botanical Header */}
      <TopHeader
        settings={settings}
        onToggleLanguage={handleToggleLanguage}
        onToggleNightMode={handleToggleNightMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLockNow={() => setIsLocked(true)}
        onGoHome={() => setCurrentView('home')}
      />

      {/* Main View Content */}
      <main className="flex-1 w-full">
        {currentView === 'home' && (
          <SanctuaryHomeView
            settings={settings}
            journals={journals}
            moods={moods}
            onOpenWriteWithTemplate={handleOpenWriteWithTemplate}
            onSelectJournal={handleOpenReader}
            onQuickMoodLog={handleQuickMoodLog}
            onOpenFullMoodModal={() => setIsMoodModalOpen(true)}
            onGoToNotebook={() => setCurrentView('notebook')}
            onGoToInsights={() => setCurrentView('insights')}
          />
        )}

        {currentView === 'notebook' && (
          <NotebookShelfView
            journals={journals}
            language={settings.language}
            onOpenWriteWithTemplate={handleOpenWriteWithTemplate}
            onSelectEntry={handleOpenReader}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentView === 'write' && (
          <JournalStudioModal
            key={`${editingEntry?.id || 'new'}-${studioTemplate}-${studioSessionKey}`}
            language={settings.language}
            defaultPaper={settings.defaultPaper}
            defaultFont={settings.defaultFont}
            initialTemplate={studioTemplate}
            initialPrompt={studioPrompt}
            editingEntry={editingEntry}
            onCancel={() => {
              setEditingEntry(null);
              setCurrentView(returnView === 'write' || returnView === 'read' ? 'home' : returnView);
            }}
            onSave={handleSaveJournal}
          />
        )}

        {currentView === 'read' && (
          <JournalReaderModal
            entry={readingEntry}
            language={settings.language}
            onClose={() => {
              setReadingEntry(null);
              setCurrentView(returnView === 'read' || returnView === 'write' ? 'notebook' : returnView);
            }}
            onEdit={handleEditJournalEntry}
            onDelete={handleDeleteJournal}
            onToggleFavorite={handleToggleFavorite}
            onUnlockCapsule={handleUnlockCapsule}
          />
        )}

        {currentView === 'insights' && (
          <CalendarAndInsightsView
            journals={journals}
            moods={moods}
            language={settings.language}
            onSelectJournal={handleOpenReader}
            onOpenMoodModal={() => setIsMoodModalOpen(true)}
            onDeleteMood={handleDeleteMood}
            onOpenWrite={() => handleOpenWriteWithTemplate('freeflow')}
          />
        )}

        {currentView === 'sanctuary' && (
          <MindfulPauseView
            language={settings.language}
            onCompleteExercise={(pts) => addBotanicalPoints(pts)}
          />
        )}
      </main>

      {/* Bottom Dock Navigation */}
      <BottomNavDock
        currentView={currentView}
        language={settings.language}
        journalCount={journals.length}
        onSelectView={setCurrentView}
        onOpenWriteStudio={() => handleOpenWriteWithTemplate('freeflow')}
      />

      {/* Detailed Mood & Body Check-In Modal */}
      <MoodCheckInModal
        isOpen={isMoodModalOpen}
        language={settings.language}
        onClose={() => setIsMoodModalOpen(false)}
        onSave={handleSaveFullMood}
      />

      {/* Preferences & JSON Backup Modal */}
      <SettingsBackupModal
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={setSettings}
        onDataRestored={handleDataRestored}
      />
    </div>
  );
};

export default App;
