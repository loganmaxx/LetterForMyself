import { ImageSourcePropType } from 'react-native';
import { MoodType } from '../types';

export interface EmotionMeta {
  id: MoodType;
  image: ImageSourcePropType;
  label: { en: string; id: string };
  color: string;
}

export const ALL_EMOTIONS: EmotionMeta[] = [
  { id: 'happy', image: require('../../assets/emotions/happy.png'), label: { en: 'Happy', id: 'Senang' }, color: '#E8A838' },
  { id: 'peaceful', image: require('../../assets/emotions/peaceful.png'), label: { en: 'Peaceful', id: 'Damai' }, color: '#4A7C59' },
  { id: 'calm', image: require('../../assets/emotions/calm.png'), label: { en: 'Calm', id: 'Tenang' }, color: '#5B8E7D' },
  { id: 'grateful', image: require('../../assets/emotions/grateful.png'), label: { en: 'Grateful', id: 'Bersyukur' }, color: '#E07A5F' },
  { id: 'confident', image: require('../../assets/emotions/confident.png'), label: { en: 'Confident', id: 'Percaya Diri' }, color: '#D4A373' },
  { id: 'energetic', image: require('../../assets/emotions/energetic.png'), label: { en: 'Energetic', id: 'Semangat' }, color: '#E76F51' },
  { id: 'excited', image: require('../../assets/emotions/excited.png'), label: { en: 'Excited', id: 'Antusias' }, color: '#F4A261' },
  { id: 'hopeful', image: require('../../assets/emotions/hopeful.png'), label: { en: 'Hopeful', id: 'Penuh Harap' }, color: '#81B29A' },
  { id: 'content', image: require('../../assets/emotions/content.png'), label: { en: 'Content', id: 'Puas & Cukup' }, color: '#6A994E' },
  { id: 'relaxed', image: require('../../assets/emotions/relaxed.png'), label: { en: 'Relaxed', id: 'Rileks' }, color: '#7EA172' },
  { id: 'safe', image: require('../../assets/emotions/safe.png'), label: { en: 'Safe', id: 'Aman' }, color: '#3D5A80' },
  { id: 'sad', image: require('../../assets/emotions/sad.png'), label: { en: 'Sad', id: 'Sedih' }, color: '#457B9D' },
  { id: 'anxious', image: require('../../assets/emotions/anxious.png'), label: { en: 'Anxious', id: 'Cemas' }, color: '#9B5DE5' },
  { id: 'sleepy', image: require('../../assets/emotions/sleepy.png'), label: { en: 'Tired', id: 'Lelah / Kantuk' }, color: '#6C757D' },
  { id: 'stressed', image: require('../../assets/emotions/stressed.png'), label: { en: 'Stressed', id: 'Stres' }, color: '#D90429' },
  { id: 'overwhelmed', image: require('../../assets/emotions/overwhelmed.png'), label: { en: 'Overwhelmed', id: 'Kewalahan' }, color: '#C1121F' },
  { id: 'lonely', image: require('../../assets/emotions/lonely.png'), label: { en: 'Lonely', id: 'Kesepian' }, color: '#6B705C' },
  { id: 'frustrated', image: require('../../assets/emotions/frustrated.png'), label: { en: 'Frustrated', id: 'Frustrasi' }, color: '#BC4749' },
  { id: 'angry', image: require('../../assets/emotions/angry.png'), label: { en: 'Angry', id: 'Marah' }, color: '#E63946' },
  { id: 'bored', image: require('../../assets/emotions/bored.png'), label: { en: 'Bored', id: 'Bosan' }, color: '#A5A58D' },
];

export const PRIMARY_HOME_EMOTIONS: EmotionMeta[] = [
  ALL_EMOTIONS[0], // happy
  ALL_EMOTIONS[1], // peaceful
  ALL_EMOTIONS[2], // calm
  ALL_EMOTIONS[11], // sad
  ALL_EMOTIONS[12], // anxious
  ALL_EMOTIONS[13], // sleepy
];
