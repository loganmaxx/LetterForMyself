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
  | 'happy'
  | 'radiant'
  | 'peaceful'
  | 'calm'
  | 'grounded'
  | 'grateful'
  | 'loved'
  | 'confident'
  | 'energetic'
  | 'excited'
  | 'hopeful'
  | 'content'
  | 'relaxed'
  | 'safe'
  | 'sad'
  | 'melancholy'
  | 'cry'
  | 'anxious'
  | 'sleepy'
  | 'stressed'
  | 'overwhelmed'
  | 'lonely'
  | 'frustrated'
  | 'angry'
  | 'bored'
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
  initialBelief: number;
  distortions: string[];
  evidenceFor: string;
  evidenceAgainst: string;
  balancedReframe: string;
  afterBelief: number;
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
  createdAt: string;
  updatedAt: string;
  template: TemplateType;
  paperTheme: PaperTheme;
  fontStyle: FontStyle;
  mood: MoodType;
  emotions: string[];
  energyLevel: number;
  tags: string[];
  promptUsed?: string;
  affirmationNote?: string;
  gratitudeList?: string[];
  cbtData?: CBTData;
  unloadData?: UnloadData;
  isFavorite: boolean;
  photoUrl?: string;
  photoCaption?: string;
  unlockDate?: string;
  isUnlocked?: boolean;
  reflectionAfterOpening?: string;
}

export interface MoodCheckIn {
  id: string;
  timestamp: string;
  mood: MoodType;
  emotions: string[];
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

export type MainView = 'home' | 'notebook' | 'insights' | 'sanctuary' | 'write' | 'read';
