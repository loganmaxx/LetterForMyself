import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, MoodCheckIn, UserSettings } from '../types';

const KEYS = {
  SETTINGS: 'letter_settings_v1',
  JOURNALS: 'letter_journals_v1',
  MOODS: 'letter_moods_v1',
};

const DEFAULT_SETTINGS: UserSettings = {
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
};

const SEED_JOURNALS: JournalEntry[] = [
  {
    id: 'seed-1',
    title: 'Napas tenang di pagi hari',
    content: 'Pagi ini terasa lebih sejuk. Menyeduh teh hangat dan duduk sebentar di dekat jendela tanpa terburu-buru membuka handphone mengingatkanku betapa damainya kesederhanaan.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    template: 'freeflow',
    paperTheme: 'botanical',
    fontStyle: 'serif',
    mood: 'peaceful',
    emotions: ['Damai', 'Bersyukur'],
    energyLevel: 4,
    tags: ['pagi', 'refleksi'],
    affirmationNote: 'Aku tidak harus terburu-buru untuk menjadi berharga.',
    isFavorite: true,
  },
  {
    id: 'seed-2',
    title: 'Melepaskan yang tidak bisa kukendalikan',
    content: 'Pikiranku sempat cemas dengan hal-hal yang belum terjadi minggu depan. Menuliskannya di lingkaran kendali membuat dadaku terasa jauh lebih lega.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    template: 'unload',
    paperTheme: 'lined',
    fontStyle: 'sans',
    mood: 'calm',
    emotions: ['Tenang', 'Rileks'],
    energyLevel: 3,
    tags: ['anxiety', 'circle-of-control'],
    unloadData: {
      withinControl: ['Caraku merespon', 'Waktu istirahatku', 'Usaha terbaik hari ini'],
      outsideControl: ['Opini orang lain', 'Cuaca', 'Jadwal yang mendadak berubah'],
      gentleNextStep: 'Tidur lebih awal dan minum air putih hangat.',
    },
    isFavorite: false,
  },
];

export const StorageService = {
  async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch {}
  },

  async getJournals(): Promise<JournalEntry[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.JOURNALS);
      return data ? JSON.parse(data) : SEED_JOURNALS;
    } catch {
      return SEED_JOURNALS;
    }
  },

  async saveJournals(journals: JournalEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.JOURNALS, JSON.stringify(journals));
    } catch {}
  },

  async getMoods(): Promise<MoodCheckIn[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.MOODS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveMoods(moods: MoodCheckIn[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.MOODS, JSON.stringify(moods));
    } catch {}
  },
};
