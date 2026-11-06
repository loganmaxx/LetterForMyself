import type { JournalEntry, MoodCheckIn, UserSettings } from '../types';

const KEYS = {
  SETTINGS: 'leaf_ink_settings_v1',
  JOURNALS: 'leaf_ink_journals_v1',
  MOODS: 'leaf_ink_moods_v1',
};

const daysAgoISO = (days: number, hour = 9): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
};

const daysFromNowISO = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString().split('T')[0];
};

const DEFAULT_SETTINGS: UserSettings = {
  name: 'Traveler',
  language: 'en',
  defaultPaper: 'parchment',
  defaultFont: 'serif',
  pinEnabled: false,
  pinCode: '',
  streakDays: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  botanicalPoints: 95, // Starts at Woodland Fern stage
};

const SEED_JOURNALS: JournalEntry[] = [
  {
    id: 'seed-j-1',
    title: 'Untangling the pressure to have everything figured out',
    content:
      'Today I noticed a familiar tightness in my shoulders while looking at my long to-do list. Walking through the CBT steps below helped me see that moving at a steady, humane pace is not falling behind—it is how sustainable roots grow.',
    createdAt: daysAgoISO(0, 10),
    updatedAt: daysAgoISO(0, 10),
    template: 'cbt',
    paperTheme: 'lined',
    fontStyle: 'serif',
    mood: 'peaceful',
    emotions: ['relieved', 'hopeful', 'healing'],
    bodySensations: ['unclenched_jaw', 'calm_breath'],
    energyLevel: 4,
    stickers: ['fern', 'tea', 'mending_heart'],
    tags: ['cbt', 'self-kindness', 'pace'],
    promptUsed: 'What is one expectation I am carrying today that I can gently set down?',
    affirmationNote: 'I am allowed to be a work in progress and still worthy of rest today.',
    cbtData: {
      situation: 'Looking at my goals for the month and realizing two projects are taking longer than planned.',
      automaticThought: 'I am falling behind everyone else and if I do not finish everything this week, I am failing.',
      initialBelief: 82,
      distortions: ['all_or_nothing', 'should_statements', 'catastrophizing'],
      evidenceFor: 'Two tasks were delayed from last week because I needed extra rest.',
      evidenceAgainst:
        'I have consistently showed up every single week, completed the core milestones, and resting prevented burnout.',
      balancedReframe:
        'Progress is rarely a straight line. Completing one meaningful step today with a calm nervous system is far healthier than rushing in panic.',
      afterBelief: 24,
    },
    isFavorite: true,
  },
  {
    id: 'seed-j-2',
    title: 'Morning Matcha & Quiet Intentions',
    content:
      'The morning air felt crisp and quiet before checking any messages. Sitting by the window for ten minutes with a warm cup of tea reminded me how much peace exists before the world asks for my attention.\n\nToday I want to move slowly, listen to my body when it asks for water or a stretch, and speak kindly to myself.',
    createdAt: daysAgoISO(1, 8),
    updatedAt: daysAgoISO(1, 8),
    template: 'morning',
    paperTheme: 'botanical',
    fontStyle: 'handwriting',
    mood: 'radiant',
    emotions: ['grateful', 'inspired', 'content'],
    bodySensations: ['warm_chest', 'calm_breath'],
    energyLevel: 5,
    stickers: ['sunflower', 'tea', 'sparkles'],
    tags: ['morning-pages', 'gratitude', 'slow-living'],
    gratitudeList: [
      'Warm sunlight streaming across the wooden desk',
      'A deep night of uninterrupted sleep',
      'Having a quiet notebook where I can be 100% honest',
    ],
    affirmationNote: 'My worth is not measured by how much I produce today.',
    isFavorite: true,
  },
  {
    id: 'seed-j-3',
    title: 'Emptying the Mental Backpack Before Sleep',
    content:
      'My mind was spinning with tomorrow’s conversations and things I cannot predict. Putting them into the Circle of Control below made my chest feel noticeably lighter.',
    createdAt: daysAgoISO(2, 21),
    updatedAt: daysAgoISO(2, 21),
    template: 'unload',
    paperTheme: 'dotgrid',
    fontStyle: 'sans',
    mood: 'grounded',
    emotions: ['overthinking', 'relieved'],
    bodySensations: ['heavy_shoulders', 'calm_breath'],
    energyLevel: 3,
    stickers: ['moon', 'candle', 'feather'],
    tags: ['evening-unload', 'boundaries', 'anxiety-relief'],
    unloadData: {
      withinControl: [
        'Preparing my notes calmly for 20 minutes tomorrow morning',
        'Going to sleep on time tonight with gentle rain audio',
        'Speaking honestly and respectfully',
      ],
      outsideControl: [
        'Other people’s immediate moods or reactions',
        'Unexpected schedule shifts next month',
        'Rewriting what already happened yesterday',
      ],
      gentleNextStep: 'Close the laptop, drink a glass of warm water, and take 4 slow box breaths.',
    },
    isFavorite: false,
  },
  {
    id: 'seed-j-4',
    title: 'A Time-Capsule Note for Next Month',
    content:
      'Dear Future Me,\n\nRight now you are learning how to trust your own timing. Remember how worried you were last month about things that eventually worked out gently? Keep tending to your daily peace first. Look how far you have already come.',
    createdAt: daysAgoISO(4, 16),
    updatedAt: daysAgoISO(4, 16),
    template: 'capsule',
    paperTheme: 'parchment',
    fontStyle: 'serif',
    mood: 'peaceful',
    emotions: ['hopeful', 'proud', 'loved'],
    bodySensations: ['warm_chest'],
    energyLevel: 4,
    stickers: ['letter_seal', 'sprout', 'dove'],
    tags: ['time-capsule', 'future-self'],
    unlockDate: daysFromNowISO(14),
    isUnlocked: false,
    isFavorite: true,
  },
];

const SEED_MOODS: MoodCheckIn[] = [
  {
    id: 'seed-m-1',
    timestamp: daysAgoISO(0, 9),
    mood: 'peaceful',
    emotions: ['grateful', 'relieved', 'healing'],
    bodySensations: ['calm_breath', 'unclenched_jaw'],
    energyLevel: 4,
    sleepQuality: 4,
    note: 'Morning journaling and reframing helped dissolve the tightness in my chest.',
  },
  {
    id: 'seed-m-2',
    timestamp: daysAgoISO(1, 11),
    mood: 'radiant',
    emotions: ['inspired', 'hopeful', 'content'],
    bodySensations: ['warm_chest', 'calm_breath'],
    energyLevel: 5,
    sleepQuality: 5,
    note: 'Sunny morning walk and quiet tea ritual.',
  },
  {
    id: 'seed-m-3',
    timestamp: daysAgoISO(2, 20),
    mood: 'anxious',
    emotions: ['overthinking', 'tired'],
    bodySensations: ['heavy_shoulders', 'tight_chest'],
    energyLevel: 2,
    sleepQuality: 3,
    note: 'Felt stretched thin before doing my evening Circle of Control unload.',
  },
  {
    id: 'seed-m-4',
    timestamp: daysAgoISO(3, 14),
    mood: 'grounded',
    emotions: ['curious', 'proud'],
    bodySensations: ['unclenched_jaw'],
    energyLevel: 4,
    sleepQuality: 4,
    note: 'Steady rhythm all afternoon.',
  },
  {
    id: 'seed-m-5',
    timestamp: daysAgoISO(4, 18),
    mood: 'melancholy',
    emotions: ['nostalgic', 'vulnerable', 'healing'],
    bodySensations: ['heavy_eyes', 'warm_chest'],
    energyLevel: 3,
    sleepQuality: 4,
    note: 'Rainy afternoon—allowed myself to rest without guilt.',
  },
];

export const StorageService = {
  getSettings(): UserSettings {
    try {
      const raw = localStorage.getItem(KEYS.SETTINGS);
      if (!raw) {
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getJournals(): JournalEntry[] {
    try {
      const raw = localStorage.getItem(KEYS.JOURNALS);
      if (!raw) {
        localStorage.setItem(KEYS.JOURNALS, JSON.stringify(SEED_JOURNALS));
        return SEED_JOURNALS;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_JOURNALS;
    }
  },

  saveJournals(entries: JournalEntry[]): void {
    localStorage.setItem(KEYS.JOURNALS, JSON.stringify(entries));
  },

  getMoods(): MoodCheckIn[] {
    try {
      const raw = localStorage.getItem(KEYS.MOODS);
      if (!raw) {
        localStorage.setItem(KEYS.MOODS, JSON.stringify(SEED_MOODS));
        return SEED_MOODS;
      }
      return JSON.parse(raw);
    } catch {
      return SEED_MOODS;
    }
  },

  saveMoods(moods: MoodCheckIn[]): void {
    localStorage.setItem(KEYS.MOODS, JSON.stringify(moods));
  },

  exportAll(): string {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'LetterForMyself',
      settings: this.getSettings(),
      journals: this.getJournals(),
      moods: this.getMoods(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importAll(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.settings) this.saveSettings(parsed.settings);
      if (Array.isArray(parsed.journals)) this.saveJournals(parsed.journals);
      if (Array.isArray(parsed.moods)) this.saveMoods(parsed.moods);
      return true;
    } catch {
      return false;
    }
  },

  resetToDemo(): void {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(KEYS.JOURNALS, JSON.stringify(SEED_JOURNALS));
    localStorage.setItem(KEYS.MOODS, JSON.stringify(SEED_MOODS));
  },
};
