import type { MoodType, PaperTheme, TemplateType } from '../types';

export interface MoodMeta {
  id: MoodType;
  emoji: string;
  iconUrl: string;
  category: 'warm' | 'calm' | 'tender';
  label: { en: string; id: string };
  subtitle: { en: string; id: string };
  bgClass: string;
  badgeClass: string;
  borderClass: string;
  accentHex: string;
  score: number; // 1 to 6 for charting
}

/** 6 primary moods shown in the 1-row quick bar on Home so it stays minimalist */
export const HOME_PRIMARY_MOODS: MoodType[] = [
  'radiant',
  'peaceful',
  'grounded',
  'melancholy',
  'anxious',
  'overwhelmed',
];

export const MOOD_META: Partial<Record<MoodType, MoodMeta>> = {
  // === WARM & BRIGHT ===
  radiant: {
    id: 'radiant',
    emoji: '😊',
    iconUrl: '/emotions/happy.png',
    category: 'warm',
    label: { en: 'Happy', id: 'Senang' },
    subtitle: { en: 'Warm, joyful, full of light', id: 'Hangat, gembira, penuh semangat' },
    bgClass: 'bg-amberwarm-50',
    badgeClass: 'bg-amberwarm-100 text-amberwarm-700 border-amberwarm-300',
    borderClass: 'border-amberwarm-300',
    accentHex: '#E2982B',
    score: 6,
  },
  excited: {
    id: 'excited',
    emoji: '🤩',
    iconUrl: '/emotions/excited.png',
    category: 'warm',
    label: { en: 'Excited', id: 'Antusias' },
    subtitle: { en: 'Energized, eager, sparkling', id: 'Bersemangat, antusias, ceria' },
    bgClass: 'bg-amberwarm-50',
    badgeClass: 'bg-amberwarm-100 text-amberwarm-700 border-amberwarm-300',
    borderClass: 'border-amberwarm-300',
    accentHex: '#E2982B',
    score: 6,
  },
  grateful: {
    id: 'grateful',
    emoji: '🥰',
    iconUrl: '/emotions/grateful.png',
    category: 'warm',
    label: { en: 'Grateful', id: 'Bersyukur' },
    subtitle: { en: 'Thankful, appreciative, warm heart', id: 'Penuh syukur, hati terasa hangat' },
    bgClass: 'bg-amberwarm-50',
    badgeClass: 'bg-amberwarm-100 text-amberwarm-700 border-amberwarm-300',
    borderClass: 'border-amberwarm-300',
    accentHex: '#E2982B',
    score: 6,
  },
  loved: {
    id: 'loved',
    emoji: '💖',
    iconUrl: '/emotions/love.png',
    category: 'warm',
    label: { en: 'Loved', id: 'Dicintai' },
    subtitle: { en: 'Connected, held, cherished', id: 'Merasa disayangi dan terhubung' },
    bgClass: 'bg-rose-50',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-300',
    borderClass: 'border-rose-300',
    accentHex: '#E11D48',
    score: 6,
  },
  hopeful: {
    id: 'hopeful',
    emoji: '🌱',
    iconUrl: '/emotions/hopeful.png',
    category: 'warm',
    label: { en: 'Hopeful', id: 'Optimis' },
    subtitle: { en: 'Looking forward with gentle trust', id: 'Menatap ke depan dengan harapan baik' },
    bgClass: 'bg-botanical-50',
    badgeClass: 'bg-botanical-100 text-botanical-800 border-botanical-300',
    borderClass: 'border-botanical-300',
    accentHex: '#4E7E6B',
    score: 5,
  },
  confident: {
    id: 'confident',
    emoji: '✨',
    iconUrl: '/emotions/confident.png',
    category: 'warm',
    label: { en: 'Confident', id: 'Percaya Diri' },
    subtitle: { en: 'Capable, assured, proud', id: 'Yakin, mampu, dan bangga pada diri' },
    bgClass: 'bg-amberwarm-50',
    badgeClass: 'bg-amberwarm-100 text-amberwarm-700 border-amberwarm-300',
    borderClass: 'border-amberwarm-300',
    accentHex: '#E2982B',
    score: 6,
  },

  // === CALM & PRESENT ===
  peaceful: {
    id: 'peaceful',
    emoji: '😌',
    iconUrl: '/emotions/peaceful.png',
    category: 'calm',
    label: { en: 'Peaceful', id: 'Tenang' },
    subtitle: { en: 'Calm, present, gently at ease', id: 'Damai, hadir utuh, lega' },
    bgClass: 'bg-botanical-50',
    badgeClass: 'bg-botanical-100 text-botanical-800 border-botanical-300',
    borderClass: 'border-botanical-300',
    accentHex: '#4E7E6B',
    score: 5,
  },
  grounded: {
    id: 'grounded',
    emoji: '🙂',
    iconUrl: '/emotions/calm.png',
    category: 'calm',
    label: { en: 'Calm', id: 'Damai' },
    subtitle: { en: 'Steady, observant, balanced', id: 'Kokoh, seimbang, rileks' },
    bgClass: 'bg-paper-warm',
    badgeClass: 'bg-paper-deep text-ink-800 border-paper-border',
    borderClass: 'border-paper-border',
    accentHex: '#6E6259',
    score: 4,
  },
  relaxed: {
    id: 'relaxed',
    emoji: '🍃',
    iconUrl: '/emotions/relaxed.png',
    category: 'calm',
    label: { en: 'Relaxed', id: 'Santai' },
    subtitle: { en: 'Unwound, light, resting easy', id: 'Rileks, tanpa beban, menikmati jeda' },
    bgClass: 'bg-botanical-50',
    badgeClass: 'bg-botanical-100 text-botanical-800 border-botanical-300',
    borderClass: 'border-botanical-300',
    accentHex: '#4E7E6B',
    score: 5,
  },
  safe: {
    id: 'safe',
    emoji: '🏡',
    iconUrl: '/emotions/safe.png',
    category: 'calm',
    label: { en: 'Safe', id: 'Aman' },
    subtitle: { en: 'Protected, comfortable, anchored', id: 'Merasa terlindungi dan nyaman' },
    bgClass: 'bg-botanical-50',
    badgeClass: 'bg-botanical-100 text-botanical-800 border-botanical-300',
    borderClass: 'border-botanical-300',
    accentHex: '#4E7E6B',
    score: 5,
  },
  content: {
    id: 'content',
    emoji: '🍵',
    iconUrl: '/emotions/content.png',
    category: 'calm',
    label: { en: 'Content', id: 'Cukup' },
    subtitle: { en: 'Satisfied with right now', id: 'Merasa cukup dengan hari ini' },
    bgClass: 'bg-paper-warm',
    badgeClass: 'bg-paper-deep text-ink-800 border-paper-border',
    borderClass: 'border-paper-border',
    accentHex: '#6E6259',
    score: 4,
  },
  sleepy: {
    id: 'sleepy',
    emoji: '🌙',
    iconUrl: '/emotions/sleepy.png',
    category: 'calm',
    label: { en: 'Sleepy', id: 'Mengantuk' },
    subtitle: { en: 'Ready for rest and quiet sleep', id: 'Butuh istirahat dan tidur nyenyak' },
    bgClass: 'bg-slate-100/80',
    badgeClass: 'bg-slate-200/80 text-slate-700 border-slate-300',
    borderClass: 'border-slate-300',
    accentHex: '#64748B',
    score: 3,
  },

  // === HEAVY & TENDER ===
  melancholy: {
    id: 'melancholy',
    emoji: '😢',
    iconUrl: '/emotions/sad.png',
    category: 'tender',
    label: { en: 'Sad', id: 'Sedih' },
    subtitle: { en: 'Heavy, tender, needing rest', id: 'Berat, lembut, butuh jeda' },
    bgClass: 'bg-slate-100/80',
    badgeClass: 'bg-slate-200/80 text-slate-700 border-slate-300',
    borderClass: 'border-slate-300',
    accentHex: '#64748B',
    score: 2,
  },
  cry: {
    id: 'cry',
    emoji: '😭',
    iconUrl: '/emotions/cry.png',
    category: 'tender',
    label: { en: 'Tearful', id: 'Ingin Menangis' },
    subtitle: { en: 'Letting tears release the weight', id: 'Biarkan air mata melepaskan beban' },
    bgClass: 'bg-slate-100/80',
    badgeClass: 'bg-slate-200/80 text-slate-700 border-slate-300',
    borderClass: 'border-slate-300',
    accentHex: '#64748B',
    score: 2,
  },
  lonely: {
    id: 'lonely',
    emoji: '🌧️',
    iconUrl: '/emotions/lonely.png',
    category: 'tender',
    label: { en: 'Lonely', id: 'Kesepian' },
    subtitle: { en: 'Craving warmth and connection', id: 'Merasa sendiri dan butuh kehangatan' },
    bgClass: 'bg-slate-100/80',
    badgeClass: 'bg-slate-200/80 text-slate-700 border-slate-300',
    borderClass: 'border-slate-300',
    accentHex: '#64748B',
    score: 2,
  },
  anxious: {
    id: 'anxious',
    emoji: '😰',
    iconUrl: '/emotions/anxious.png',
    category: 'tender',
    label: { en: 'Anxious', id: 'Cemas' },
    subtitle: { en: 'Restless mind, fluttering chest', id: 'Pikiran ramai, dada berdebar' },
    bgClass: 'bg-terracotta-50',
    badgeClass: 'bg-terracotta-100 text-terracotta-800 border-terracotta-300',
    borderClass: 'border-terracotta-300',
    accentHex: '#D46A44',
    score: 2,
  },
  overwhelmed: {
    id: 'overwhelmed',
    emoji: '😣',
    iconUrl: '/emotions/overwhelmed.png',
    category: 'tender',
    label: { en: 'Tired', id: 'Lelah' },
    subtitle: { en: 'Too much at once, needing anchor', id: 'Terlalu banyak beban sekaligus' },
    bgClass: 'bg-rose-50',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    borderClass: 'border-rose-300',
    accentHex: '#BE123C',
    score: 1,
  },
  stressed: {
    id: 'stressed',
    emoji: '😫',
    iconUrl: '/emotions/stressed.png',
    category: 'tender',
    label: { en: 'Stressed', id: 'Stres' },
    subtitle: { en: 'Under pressure, tight shoulders', id: 'Tertekan dan butuh bernapas lega' },
    bgClass: 'bg-rose-50',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
    borderClass: 'border-rose-300',
    accentHex: '#BE123C',
    score: 1,
  },
  frustrated: {
    id: 'frustrated',
    emoji: '😤',
    iconUrl: '/emotions/frustrated.png',
    category: 'tender',
    label: { en: 'Frustrated', id: 'Kesal' },
    subtitle: { en: 'Stuck, annoyed, needing release', id: 'Gemas, kesal, tidak sesuai harapan' },
    bgClass: 'bg-terracotta-50',
    badgeClass: 'bg-terracotta-100 text-terracotta-800 border-terracotta-300',
    borderClass: 'border-terracotta-300',
    accentHex: '#D46A44',
    score: 2,
  },
  confused: {
    id: 'confused',
    emoji: '😵‍💫',
    iconUrl: '/emotions/confused.png',
    category: 'tender',
    label: { en: 'Confused', id: 'Bingung' },
    subtitle: { en: 'Uncertain, tangled thoughts', id: 'Bimbang, arah pikiran belum jelas' },
    bgClass: 'bg-paper-warm',
    badgeClass: 'bg-paper-deep text-ink-800 border-paper-border',
    borderClass: 'border-paper-border',
    accentHex: '#6E6259',
    score: 3,
  },
};

export const EMOTION_OPTIONS: { id: string; en: string; idLabel: string; category: 'warm' | 'tender' }[] = [
  { id: 'grateful', en: 'Grateful', idLabel: 'Bersyukur', category: 'warm' },
  { id: 'hopeful', en: 'Hopeful', idLabel: 'Penuh Harap', category: 'warm' },
  { id: 'relieved', en: 'Relieved', idLabel: 'Lega', category: 'warm' },
  { id: 'inspired', en: 'Inspired', idLabel: 'Terinspirasi', category: 'warm' },
  { id: 'loved', en: 'Loved', idLabel: 'Dicintai', category: 'warm' },
  { id: 'curious', en: 'Curious', idLabel: 'Ingin Tahu', category: 'warm' },
  { id: 'proud', en: 'Quietly Proud', idLabel: 'Bangga', category: 'warm' },
  { id: 'content', en: 'Content', idLabel: 'Cukup & Puas', category: 'warm' },
  { id: 'tired', en: 'Exhausted', idLabel: 'Lelah Batin', category: 'tender' },
  { id: 'overthinking', en: 'Overthinking', idLabel: 'Overthinking', category: 'tender' },
  { id: 'lonely', en: 'Lonely', idLabel: 'Kesepian', category: 'tender' },
  { id: 'vulnerable', en: 'Vulnerable', idLabel: 'Rapuh', category: 'tender' },
  { id: 'frustrated', en: 'Frustrated', idLabel: 'Frustrasi', category: 'tender' },
  { id: 'insecure', en: 'Self-Doubting', idLabel: 'Ragu Diri', category: 'tender' },
  { id: 'nostalgic', en: 'Nostalgic', idLabel: 'Rindu Masa Lalu', category: 'tender' },
  { id: 'healing', en: 'Slowly Healing', idLabel: 'Sedang Pulih', category: 'warm' },
];

export const BODY_SENSATIONS: { id: string; icon: string; en: string; idLabel: string }[] = [
  { id: 'calm_breath', icon: '🌬️', en: 'Deep, steady breath', idLabel: 'Napas dalam & tenang' },
  { id: 'warm_chest', icon: '☀️', en: 'Warmth in chest', idLabel: 'Dada terasa hangat' },
  { id: 'unclenched_jaw', icon: '🍃', en: 'Soft shoulders & jaw', idLabel: 'Bahu & rahang rileks' },
  { id: 'heavy_shoulders', icon: '🪨', en: 'Heavy shoulders/neck', idLabel: 'Bahu & leher terasa berat' },
  { id: 'tight_chest', icon: '⚡', en: 'Tightness in chest', idLabel: 'Dada terasa sesak/tegang' },
  { id: 'butterflies', icon: '🦋', en: 'Knots in stomach', idLabel: 'Perut terasa melilit/tegang' },
  { id: 'restless_hands', icon: '〰️', en: 'Restless energy', idLabel: 'Tubuh gelisah' },
  { id: 'heavy_eyes', icon: '🌙', en: 'Tired, heavy eyes', idLabel: 'Mata & kepala lelah' },
];

export interface PaperThemeMeta {
  id: PaperTheme;
  cssClass: string;
  swatchBg: string;
  isDark?: boolean;
  name: { en: string; id: string };
  desc: { en: string; id: string };
}

export const PAPER_THEMES: PaperThemeMeta[] = [
  {
    id: 'parchment',
    cssClass: 'paper-parchment',
    swatchBg: '#FCF8F2',
    name: { en: 'Warm Parchment', id: 'Perkamen Hangat' },
    desc: { en: 'Soft cream speckled cotton paper', id: 'Kertas katun krem lembut klasik' },
  },
  {
    id: 'lined',
    cssClass: 'paper-lined',
    swatchBg: '#FFFDF9',
    name: { en: 'Botanical Ruled', id: 'Buku Bergaris Sage' },
    desc: { en: 'Gentle sage horizontal notebook lines', id: 'Garis buku catatan hijau sage lembut' },
  },
  {
    id: 'dotgrid',
    cssClass: 'paper-dotgrid',
    swatchBg: '#FAF7F2',
    name: { en: 'Architect Dot-Grid', id: 'Titik Bullet Grid' },
    desc: { en: 'Structured dotted grid for mindful clarity', id: 'Grid titik rapi untuk pikiran terstruktur' },
  },
  {
    id: 'botanical',
    cssClass: 'paper-botanical',
    swatchBg: '#F4F8F5',
    name: { en: 'Pressed Herbarium', id: 'Herbarium Daun' },
    desc: { en: 'Misty sage & morning dew wash', id: 'Nuansa embun pagi & daun teh hijau' },
  },
  {
    id: 'terracotta',
    cssClass: 'paper-terracotta',
    swatchBg: '#FDF6F3',
    name: { en: 'Terracotta Blush', id: 'Terakota Senja' },
    desc: { en: 'Warm clay-tinted lined sanctuary paper', id: 'Kertas bergaris hangat warna tanah liat' },
  },
  {
    id: 'midnight',
    cssClass: 'paper-midnight',
    swatchBg: '#1E242B',
    isDark: true,
    name: { en: 'Midnight Starlight', id: 'Malam Berbintang' },
    desc: { en: 'Deep slate night mode for late reflections', id: 'Kertas gelap tenang untuk renungan malam' },
  },
];

export interface StickerItem {
  id: string;
  emoji: string;
  en: string;
  idLabel: string;
}

export const BOTANICAL_STICKERS: StickerItem[] = [
  { id: 'fern', emoji: '🌿', en: 'Pressed Fern', idLabel: 'Daun Pakis' },
  { id: 'tea', emoji: '🍵', en: 'Warm Matcha', idLabel: 'Teh Hangat' },
  { id: 'candle', emoji: '🕯️', en: 'Beeswax Candle', idLabel: 'Lilin Aromaterapi' },
  { id: 'sunflower', emoji: '🌻', en: 'Golden Bloom', idLabel: 'Bunga Matahari' },
  { id: 'mushroom', emoji: '🍄', en: 'Woodland Cap', idLabel: 'Jamur Hutan' },
  { id: 'butterfly', emoji: '🦋', en: 'Gentle Metamorphosis', idLabel: 'Kupu-Kupu' },
  { id: 'mending_heart', emoji: '❤️‍🩹', en: 'Healing Heart', idLabel: 'Hati yang Pulih' },
  { id: 'moon', emoji: '🌙', en: 'Quiet Crescent', idLabel: 'Bulan Sabit' },
  { id: 'sprout', emoji: '🌱', en: 'New Beginning', idLabel: 'Tunas Baru' },
  { id: 'feather', emoji: '🪶', en: 'Lightness', idLabel: 'Bulu Lembut' },
  { id: 'letter_seal', emoji: '💌', en: 'Wax Sealed', idLabel: 'Segel Surat' },
  { id: 'sparkles', emoji: '✨', en: 'Small Magic', idLabel: 'Keajaiban Kecil' },
  { id: 'raincloud', emoji: '🌧️', en: 'Passing Rain', idLabel: 'Hujan Reda' },
  { id: 'dove', emoji: '🕊️', en: 'Inner Peace', idLabel: 'Merpati Damai' },
];

export interface CognitiveDistortionMeta {
  id: string;
  icon: string;
  name: { en: string; id: string };
  desc: { en: string; id: string };
  reframeTip: { en: string; id: string };
}

export const COGNITIVE_DISTORTIONS: CognitiveDistortionMeta[] = [
  {
    id: 'all_or_nothing',
    icon: '🌓',
    name: { en: 'All-or-Nothing Thinking', id: 'Pola Pikir Hitam-Putih' },
    desc: {
      en: 'Seeing things in extremes—if it is not 100% perfect, it feels like a total failure.',
      id: 'Melihat segalanya secara ekstrem—jika tidak sempurna 100%, dianggap gagal total.',
    },
    reframeTip: {
      en: 'What does the middle ground or "good enough" look like here?',
      id: 'Seperti apa area abu-abu atau progres yang "cukup baik" dalam situasi ini?',
    },
  },
  {
    id: 'catastrophizing',
    icon: '🌋',
    name: { en: 'Catastrophizing', id: 'Katastrofisasi (Skenario Terburuk)' },
    desc: {
      en: 'Jumping straight to the worst-case disaster scenario and assuming you could not cope.',
      id: 'Langsung melompat ke skenario bencana terburuk yang belum tentu terjadi.',
    },
    reframeTip: {
      en: 'What is the most realistic outcome, rather than the most frightening one?',
      id: 'Apa hasil yang paling realistis dan wajar, bukan yang paling menakutkan?',
    },
  },
  {
    id: 'mind_reading',
    icon: '🔮',
    name: { en: 'Mind Reading', id: 'Membaca Pikiran Orang Lain' },
    desc: {
      en: 'Assuming someone is judging or upset with you without actual evidence.',
      id: 'Berasumsi orang lain menilai buruk atau kecewa padamu tanpa bukti nyata.',
    },
    reframeTip: {
      en: 'Could their reaction be about their own busy day or stress rather than you?',
      id: 'Mungkinkah sikap mereka karena kesibukan mereka sendiri, bukan karena dirimu?',
    },
  },
  {
    id: 'emotional_reasoning',
    icon: '🌊',
    name: { en: 'Emotional Reasoning', id: 'Penalaran Emosional' },
    desc: {
      en: '"I feel anxious or inadequate, therefore it must be true that I am failing."',
      id: '"Aku merasa cemas atau gagal, berarti itu pasti fakta yang sebenarnya."',
    },
    reframeTip: {
      en: 'Feelings are valid weather patterns, not courtroom facts.',
      id: 'Perasaan itu nyata dan valid seperti cuaca, namun perasaan bukanlah fakta mutlak.',
    },
  },
  {
    id: 'should_statements',
    icon: '📏',
    name: { en: '"Should" & "Must" Pressure', id: 'Tekanan Kata "Harusnya"' },
    desc: {
      en: 'Punishing yourself with rigid rules ("I should be further ahead by now").',
      id: 'Menghukum diri dengan aturan kaku ("Aku seharusnya sudah lebih sukses sekarang").',
    },
    reframeTip: {
      en: 'Try replacing "I should" with "It would be nice if, and I am doing what I can."',
      id: 'Ubah kata "Aku harusnya..." menjadi "Aku sedang berusaha semampuku saat ini."',
    },
  },
  {
    id: 'mental_filter',
    icon: '🔍',
    name: { en: 'Negative Mental Filter', id: 'Filter Mental Negatif' },
    desc: {
      en: 'Zooming in on one small critique while ignoring ten things that went well.',
      id: 'Hanya fokus pada satu kekurangan kecil dan mengabaikan banyak hal baik lainnya.',
    },
    reframeTip: {
      en: 'If you zoomed out to the whole picture, what small wins are also present?',
      id: 'Jika melihat gambaran utuh, hal kecil apa yang sebenarnya sudah berjalan baik?',
    },
  },
  {
    id: 'overgeneralization',
    icon: '♾️',
    name: { en: 'Overgeneralization ("Always/Never")', id: 'Generalisasi Berlebihan ("Selalu/Tidak Pernah")' },
    desc: {
      en: 'Turning one tough moment into a permanent law ("I always mess things up").',
      id: 'Menganggap satu kejadian buruk sebagai pola permanen ("Aku selalu saja gagal").',
    },
    reframeTip: {
      en: 'Notice words like "always" or "never"—this was one specific moment in time.',
      id: 'Sadari kata "selalu" atau "tidak pernah"—ini hanyalah satu momen, bukan selamanya.',
    },
  },
  {
    id: 'personalization',
    icon: '🎯',
    name: { en: 'Self-Blame / Personalization', id: 'Menyalahkan Diri Sendiri' },
    desc: {
      en: 'Taking 100% blame for events that depend on many external factors.',
      id: 'Memikul seluruh rasa bersalah atas hal yang berada di luar kendalimu.',
    },
    reframeTip: {
      en: 'What other factors outside of you contributed to this situation?',
      id: 'Faktor eksternal apa saja di luar dirimu yang turut memengaruhi kejadian ini?',
    },
  },
];

export interface TemplateMeta {
  id: TemplateType;
  icon: string;
  badgeColor: string;
  name: { en: string; id: string };
  tagline: { en: string; id: string };
  placeholder: { en: string; id: string };
  defaultTitle: { en: string; id: string };
}

export const JOURNAL_TEMPLATES: TemplateMeta[] = [
  {
    id: 'freeflow',
    icon: '🪶',
    badgeColor: 'bg-botanical-100 text-botanical-800 border-botanical-200',
    name: { en: 'Freeflow Sanctuary', id: 'Jurnal Bebas Mengalir' },
    tagline: { en: 'Unstructured space to pour your heart onto paper', id: 'Ruang bebas tanpa aturan untuk mencurahkan isi hati' },
    placeholder: {
      en: 'Let your thoughts spill onto the page without editing or judging yourself...',
      id: 'Biarkan pikiran dan perasaanmu mengalir di atas kertas tanpa perlu dihakimi...',
    },
    defaultTitle: { en: 'Quiet Reflections', id: 'Catatan Hati Hari Ini' },
  },
  {
    id: 'cbt',
    icon: '🌱',
    badgeColor: 'bg-amberwarm-100 text-amberwarm-800 border-amberwarm-300',
    name: { en: 'CBT Thought Reframer', id: 'Reframe Pikiran (CBT)' },
    tagline: { en: 'Untangle anxious thoughts & cognitive distortions gently', id: 'Urai pikiran cemas & temukan sudut pandang yang lebih berimbang' },
    placeholder: {
      en: 'Add any extra reflections on how your body and mind feel after reframing this thought...',
      id: 'Tambahkan catatan ekstra tentang bagaimana perasaan tubuh dan pikiranmu setelah mengurai pikiran ini...',
    },
    defaultTitle: { en: 'Untangling a Heavy Thought', id: 'Mengurai Pikiran yang Mengganjal' },
  },
  {
    id: 'unload',
    icon: '🍃',
    badgeColor: 'bg-terracotta-100 text-terracotta-800 border-terracotta-300',
    name: { en: 'Anxiety Unload & Circle of Control', id: 'Urai Cemas & Lingkar Kendali' },
    tagline: { en: 'Separate what you can control from what you can release', id: 'Pisahkan hal yang bisa kamu kendalikan dan yang perlu dilepaskan' },
    placeholder: {
      en: 'Write down everything swirling in your head right now—empty the mental backpack...',
      id: 'Tumpahkan semua beban yang berputar di kepalamu saat ini agar terasa lebih ringan...',
    },
    defaultTitle: { en: 'Setting Down Heavy Things', id: 'Meletakkan Beban Sejenak' },
  },
  {
    id: 'morning',
    icon: '☀️',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    name: { en: 'Morning Intention Ritual', id: 'Ritual Niat Pagi' },
    tagline: { en: 'Begin the day with gentle focus, energy check & gratitude', id: 'Mulai hari dengan fokus lembut, rasa syukur, dan niat baik' },
    placeholder: {
      en: 'Today, I want to move through the world with...\n\nOne gentle priority for today is...\n\nHow I will be kind to myself today:',
      id: 'Hari ini, aku ingin melangkah dengan perasaan...\n\nSatu prioritas lembutku hari ini adalah...\n\nCara aku menyayangi diriku hari ini:',
    },
    defaultTitle: { en: 'Morning Pages & Intentions', id: 'Halaman Pagi & Niat Hari Ini' },
  },
  {
    id: 'evening',
    icon: '🌙',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    name: { en: 'Evening Wind-Down', id: 'Jeda Malam & Pelepasan' },
    tagline: { en: 'Celebrate quiet wins and close the tabs in your mind before sleep', id: 'Rayakan pencapaian kecil dan istirahatkan pikiran sebelum tidur' },
    placeholder: {
      en: 'A small moment from today I want to remember:\n\nSomething I give myself permission to put down tonight:\n\nA thank-you to my body today:',
      id: 'Momen kecil hari ini yang ingin kusimpan:\n\nHal yang kuizinkan untuk kulepaskan malam ini:\n\nTerima kasih untuk tubuhku hari ini karena:',
    },
    defaultTitle: { en: 'Closing the Day Gently', id: 'Menutup Hari dengan Tenang' },
  },
  {
    id: 'compassion',
    icon: '❤️‍🩹',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    name: { en: 'Self-Compassion Pause', id: 'Surat Welas Asih Diri' },
    tagline: { en: 'Speak to yourself the way you would comfort a dear friend', id: 'Bicara pada dirimu selembut kamu menenangkan sahabat terdekatmu' },
    placeholder: {
      en: 'What hurts right now is...\n\nIt makes sense that I feel this way because...\n\nIf a friend I loved felt this exact way, I would tell them:',
      id: 'Hal yang sedang terasa berat bagiku saat ini adalah...\n\nWajar jika aku merasa begini karena...\n\nJika sahabatku mengalami ini, aku akan memeluknya dan berkata:',
    },
    defaultTitle: { en: 'A Gentle Note to Myself', id: 'Pelukan Hangat untuk Diriku' },
  },
  {
    id: 'capsule',
    icon: '💌',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    name: { en: 'Time-Capsule Letter', id: 'Surat Kapsul Waktu' },
    tagline: { en: 'Seal a letter for your future self to unlock on a chosen date', id: 'Segel surat untuk dirimu di masa depan yang terbuka pada tanggal pilihan' },
    placeholder: {
      en: 'Dear Future Me,\n\nRight now, here is what life feels like, what I am learning, and what I hope you remember when you open this...',
      id: 'Untuk Diriku di Masa Depan,\n\nSaat aku menulis surat ini, beginilah rasanya hidupku sekarang, hal yang sedang kupelajari, dan harapanku saat kamu membukanya nanti...',
    },
    defaultTitle: { en: 'Letter to Future Me', id: 'Surat untuk Diriku Nanti' },
  },
];

export const GUIDED_PROMPTS: { category: { en: string; id: string }; en: string; id: string }[] = [
  {
    category: { en: 'Emotional Check-In', id: 'Cek Perasaan' },
    en: 'If my current emotion were a season or weather pattern, what would it look like, and what shelter does it need?',
    id: 'Jika perasaanku saat ini adalah sebuah cuaca atau musim, seperti apa bentuknya dan perlindungan apa yang ia butuhkan?',
  },
  {
    category: { en: 'Inner Peace', id: 'Ketenangan Batin' },
    en: 'What is one expectation I am carrying today that I can gently set down?',
    id: 'Ekspektasi apa yang sedang kupikul hari ini yang sebenarnya boleh kuturunkan perlahan?',
  },
  {
    category: { en: 'Self-Compassion', id: 'Welas Asih' },
    en: 'What have I been quietly surviving or handling lately that deserves a moment of credit?',
    id: 'Hal berat apa yang diam-diam berhasil kulalui belakangan ini yang layak mendapat apresiasi?',
  },
  {
    category: { en: 'Gratitude & Presence', id: 'Syukur & Kehadiran' },
    en: 'Name three tiny, ordinary sensory details from the last 24 hours that brought a flicker of comfort.',
    id: 'Sebutkan tiga hal sederhana dalam 24 jam terakhir yang memberi secercah rasa nyaman di hatimu.',
  },
  {
    category: { en: 'Healing & Boundaries', id: 'Pemulihan & Batasan' },
    en: 'Where in my life am I saying "yes" when my nervous system is quietly whispering "no"?',
    id: 'Di bagian mana dalam hidupku aku berkata "ya", padahal tubuh dan hatiku berbisik "tidak"?',
  },
  {
    category: { en: 'Future Self', id: 'Diri Masa Depan' },
    en: 'Imagine yourself one year from today feeling safe and at peace. What habits or boundaries helped you get there?',
    id: 'Bayangkan dirimu satu tahun dari sekarang merasa aman dan damai. Kebiasaan lembut apa yang membawamu ke sana?',
  },
  {
    category: { en: 'Unloading Anxiety', id: 'Mengurai Cemas' },
    en: 'What am I trying to solve in advance right now that doesn’t actually need an answer today?',
    id: 'Hal apa yang sedang kupaksakan untuk selesai di kepalaku sekarang, padahal belum butuh jawaban hari ini?',
  },
  {
    category: { en: 'Inner Child', id: 'Inner Child' },
    en: 'What did the younger version of me need to hear when they felt overwhelmed or afraid?',
    id: 'Kalimat menenangkan apa yang paling ingin didengar oleh versi kecil diriku saat ia merasa takut atau sendirian?',
  },
];

export const DAILY_QUOTES: { text: { en: string; id: string }; author: string }[] = [
  {
    text: {
      en: 'You do not have to bloom in every season. Even the tallest forest trees spend months simply resting and gathering roots.',
      id: 'Kamu tidak harus mekar di setiap musim. Bahkan pohon tertinggi di hutan pun punya waktu untuk sekadar beristirahat dan menguatkan akar.',
    },
    author: 'LetterForMyself Sanctuary',
  },
  {
    text: {
      en: 'Paper has more patience than people. Everything you set down here is one less weight your chest has to carry alone.',
      id: 'Kertas memiliki kesabaran yang tak terbatas. Setiap kalimat yang kau tulis di sini adalah satu beban yang tak lagi harus kau pikul sendirian.',
    },
    author: 'Anne Frank (Adapted)',
  },
  {
    text: {
      en: 'Feelings are visitors. Let them sit by the hearth for a moment, listen to what they need, and let them pass when they are ready.',
      id: 'Perasaan adalah tamu yang singgah. Biarkan ia duduk sejenak, dengarkan pesannya dengan lembut, dan biarkan ia berlalu saat waktunya tiba.',
    },
    author: 'Rumi (Inspired)',
  },
  {
    text: {
      en: 'Almost everything will work again if you unplug it for a few minutes, including you.',
      id: 'Hampir segala hal akan kembali bekerja dengan baik jika diberi jeda sejenak—termasuk dirimu.',
    },
    author: 'Anne Lamott',
  },
];

export const BOTANICAL_STAGES = [
  {
    minPoints: 0,
    icon: '🌰',
    name: { en: 'Quiet Seed', id: 'Benih Tenang' },
    desc: { en: 'Resting in warm soil, ready to begin', id: 'Beristirahat di tanah hangat, siap bertumbuh' },
  },
  {
    minPoints: 30,
    icon: '🌱',
    name: { en: 'First Sprout', id: 'Tunas Pertama' },
    desc: { en: 'Reaching gently toward the morning light', id: 'Mulai menyapa cahaya pagi dengan lembut' },
  },
  {
    minPoints: 80,
    icon: '🌿',
    name: { en: 'Woodland Fern', id: 'Pakis Hutan Teduh' },
    desc: { en: 'Unfurling resilient green fronds day by day', id: 'Membentangkan daun hijau yang tangguh setiap hari' },
  },
  {
    minPoints: 160,
    icon: '🪴',
    name: { en: 'Sanctuary Monstera', id: 'Monstera Sanctuary' },
    desc: { en: 'Deeply rooted, thriving in mindful awareness', id: 'Berakar kuat, tumbuh subur dalam kesadaran penuh' },
  },
  {
    minPoints: 300,
    icon: '🌸',
    name: { en: 'Blooming Camellia', id: 'Kamelia Mekar' },
    desc: { en: 'A flourishing garden of self-compassion & clarity', id: 'Taman kesadaran dan welas asih yang mekar sempurna' },
  },
];

export const UI_TEXT = {
  en: {
    appName: 'LetterForMyself',
    appSubtitle: 'Mindful Journaling & Mental Health Companion',
    navHome: 'Sanctuary',
    navNotebook: 'Notebook',
    navWrite: 'Write Page',
    navInsights: 'Calendar & Insights',
    navPause: 'Breathe & Ground',
    writeNewPage: 'New Journal Page',
    quickMoodTitle: 'How is your inner weather right now?',
    quickMoodSub: 'Check in with your heart & body—no judgment, just gentle noticing.',
    logMoodBtn: 'Detailed Body & Mood Check-In',
    templatesHeading: 'Choose a Journaling Ritual',
    templatesSub: 'Start with a blank tactile page or a guided psychological tool',
    recentPages: 'Recent Pages in Your Notebook',
    viewAllPages: 'Open Full Notebook',
    gardenTitle: 'Your Mindful Herbarium',
    streakLabel: 'Mindful Streak',
    daysUnit: 'days',
    pagesWritten: 'Pages Written',
    wordsPoured: 'Words Poured',
    cbtReframed: 'Thoughts Reframed',
    ambientSound: 'Ambient Studio',
    voiceDictation: 'Voice-to-Text',
    listening: 'Listening... Speak freely',
    paperStyle: 'Paper Texture',
    fontStyle: 'Ink Typography',
    stickersLabel: 'Page Stickers',
    guidedPromptsBtn: 'Inspire Prompt',
    saveEntryBtn: 'Save to Notebook',
    cancelBtn: 'Close',
    searchPlaceholder: 'Search titles, thoughts, tags, or CBT reframes...',
    allTemplates: 'All Pages',
    favoritesOnly: 'Starred',
    calendarTitle: 'Emotional & Writing Calendar',
    insightsTitle: 'Inner Rhythm & CBT Insights',
    bodyMapTitle: 'Where Feelings Live in Your Body',
    distortionChartTitle: 'Cognitive Distortions Reframed',
    breatheTitle: 'Nervous System Reset & Grounding',
    sosGrounding: '5-4-3-2-1 Panic Grounding',
    soundMixerTitle: 'Tactile Ambient Soundscape Mixer',
  },
  id: {
    appName: 'LetterForMyself',
    appSubtitle: 'Teman Jurnal & Kesehatan Mental',
    navHome: 'Beranda',
    navNotebook: 'Buku Jurnal',
    navWrite: 'Tulis Jurnal',
    navInsights: 'Kalender & Analisis',
    navPause: 'Napas & Tenang',
    writeNewPage: 'Tulis Halaman Baru',
    quickMoodTitle: 'Bagaimana cuaca batinmu saat ini?',
    quickMoodSub: 'Kenali apa yang dirasakan hati dan tubuhmu tanpa menghakimi.',
    logMoodBtn: 'Catat Emosi & Sensasi Tubuh Lengkap',
    templatesHeading: 'Pilih Ritual Menulismu',
    templatesSub: 'Mulai dengan kertas bebas atau panduan terapi CBT & pengurai cemas',
    recentPages: 'Halaman Terbaru di Buku Jurnalmu',
    viewAllPages: 'Buka Semua Jurnal',
    gardenTitle: 'Kebun Kesadaranmu',
    streakLabel: 'Hari Berkesadaran',
    daysUnit: 'hari',
    pagesWritten: 'Halaman Tertulis',
    wordsPoured: 'Kata Tercurah',
    cbtReframed: 'Pikiran Diurai',
    ambientSound: 'Suara Alam',
    voiceDictation: 'Suara ke Teks',
    listening: 'Mendengarkan... Bicaralah',
    paperStyle: 'Tekstur Kertas',
    fontStyle: 'Gaya Tulisan',
    stickersLabel: 'Stiker Halaman',
    guidedPromptsBtn: 'Ide Prompt',
    saveEntryBtn: 'Simpan ke Buku Jurnal',
    cancelBtn: 'Tutup',
    searchPlaceholder: 'Cari judul, isi jurnal, tag, atau catatan CBT...',
    allTemplates: 'Semua Halaman',
    favoritesOnly: 'Berbintang',
    calendarTitle: 'Kalender Emosi & Jurnal',
    insightsTitle: 'Ritme Batin & Wawasan CBT',
    bodyMapTitle: 'Peta Sensasi di Tubuhmu',
    distortionChartTitle: 'Distorsi Kognitif yang Berhasil Diurai',
    breatheTitle: 'Reset Sistem Saraf & Pernapasan',
    sosGrounding: 'Grounding Panik 5-4-3-2-1',
    soundMixerTitle: 'Peracik Suara Latar Menenangkan',
  },
};

export function getBotanicalStage(points: number) {
  let current = BOTANICAL_STAGES[0];
  let next = BOTANICAL_STAGES[1] || null;
  for (let i = 0; i < BOTANICAL_STAGES.length; i++) {
    if (points >= BOTANICAL_STAGES[i].minPoints) {
      current = BOTANICAL_STAGES[i];
      next = BOTANICAL_STAGES[i + 1] || null;
    }
  }
  return { current, next };
}
