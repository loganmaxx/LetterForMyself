export type Language = 'en' | 'id';

export type PaperTheme =
  | 'parchment'
  | 'lined'
  | 'dotgrid'
  | 'botanical'
  | 'terracotta'
  | 'midnight';

export type FontStyle = 'serif' | 'sans' | 'handwriting';

export type MoodType =
  | 'radiant'
  | 'excited'
  | 'grateful'
  | 'loved'
  | 'hopeful'
  | 'confident'
  | 'peaceful'
  | 'grounded'
  | 'relaxed'
  | 'safe'
  | 'content'
  | 'sleepy'
  | 'melancholy'
  | 'cry'
  | 'lonely'
  | 'anxious'
  | 'overwhelmed'
  | 'stressed'
  | 'frustrated'
  | 'confused';

export type TemplateType =
  | 'freeflow'
  | 'cbt'
  | 'unload'
  | 'morning'
  | 'evening'
  | 'compassion'
  | 'capsule';

export interface CBTData {
  situation: string;
  automaticThought: string;
  initialBelief: number; // 0 - 100
  distortions: string[]; // distortion IDs
  evidenceFor: string;
  evidenceAgainst: string;
  balancedReframe: string;
  afterBelief: number; // 0 - 100
}

export interface UnloadData {
  withinControl: string[];
  outsideControl: string[];
  gentleNextStep: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  template: TemplateType;
  paperTheme: PaperTheme;
  fontStyle: FontStyle;
  mood: MoodType;
  emotions: string[];
  bodySensations: string[];
  energyLevel: number; // 1 - 5
  stickers: string[]; // sticker IDs
  tags: string[];
  promptUsed?: string;
  affirmationNote?: string;
  gratitudeList?: string[];
  cbtData?: CBTData;
  unloadData?: UnloadData;
  voiceUsed?: boolean;
  isFavorite: boolean;
  // Polaroid Memory Photo
  photoUrl?: string;
  photoCaption?: string;
  // For Time-Capsule Letters
  unlockDate?: string;
  isUnlocked?: boolean;
  reflectionAfterOpening?: string;
}

export interface MoodCheckIn {
  id: string;
  timestamp: string;
  mood: MoodType;
  emotions: string[];
  bodySensations: string[];
  energyLevel: number; // 1 - 5
  sleepQuality: number; // 1 - 5
  note: string;
}

export interface UserSettings {
  name: string;
  language: Language;
  defaultPaper: PaperTheme;
  defaultFont: FontStyle;
  nightMode?: boolean;
  pinEnabled: boolean;
  pinCode: string;
  streakDays: number;
  lastActiveDate: string;
  botanicalPoints: number;
}

export type MainView = 'home' | 'notebook' | 'write' | 'read' | 'insights' | 'sanctuary';
