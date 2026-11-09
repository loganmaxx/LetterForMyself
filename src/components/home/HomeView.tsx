import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Sparkles, ArrowRight, HeartHandshake } from 'lucide-react-native';
import { JournalEntry, Language, MoodCheckIn, MoodType, TemplateType } from '../../types';
import { ALL_EMOTIONS, PRIMARY_HOME_EMOTIONS } from '../../constants/emotions';
import { PALETTE } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';

interface HomeViewProps {
  language: Language;
  nightMode: boolean;
  journals: JournalEntry[];
  moods: MoodCheckIn[];
  onOpenWrite: (tpl?: TemplateType, prompt?: string) => void;
  onOpenReader: (entry: JournalEntry) => void;
  onQuickMood: (mood: MoodType) => void;
  onOpenAllMoods: () => void;
  onGoToNotebook: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  language,
  nightMode,
  journals,
  moods,
  onOpenWrite,
  onOpenReader,
  onQuickMood,
  onOpenAllMoods,
  onGoToNotebook,
}) => {
  const isNight = nightMode;
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 11
      ? language === 'id' ? 'Selamat Pagi' : 'Good Morning'
      : currentHour < 15
      ? language === 'id' ? 'Selamat Siang' : 'Good Afternoon'
      : currentHour < 18
      ? language === 'id' ? 'Selamat Sore' : 'Good Evening'
      : language === 'id' ? 'Selamat Malam' : 'Cozy Night';

  const todayIso = new Date().toISOString().split('T')[0];
  const todayMood = moods.find((m) => m.timestamp.startsWith(todayIso));
  const todayEmotionMeta = todayMood
    ? ALL_EMOTIONS.find((e) => e.id === todayMood.mood)
    : null;

  return (
    <ScrollView
      style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Sanctuary Greeting Header */}
      <View style={styles.greetingSection}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={[styles.greetingSub, isNight && { color: PALETTE.nightInkMuted }]}>
              {language === 'id' ? 'Ruang Tenang Jiwa' : 'Sanctuary for your thoughts'}
            </Text>
            <Text style={[styles.greetingTitle, isNight && { color: PALETTE.nightInk }]}>
              {greeting}, Traveler ✨
            </Text>
          </View>

          {todayEmotionMeta && (
            <View style={[styles.todayMoodBadge, isNight && { backgroundColor: PALETTE.nightCardSecondary }]}>
              <Image source={todayEmotionMeta.image} style={styles.todayMoodImg} resizeMode="contain" />
              <Text style={[styles.todayMoodText, isNight && { color: PALETTE.nightInk }]}>
                {todayEmotionMeta.label[language]}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 2. Slim 3D Mood Bar */}
      <View style={[styles.card, isNight && styles.nightCard]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, isNight && { color: PALETTE.nightInk }]}>
            {language === 'id' ? 'Cuaca hatimu saat ini' : 'Inner Weather Right Now'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              HapticsService.light();
              onOpenAllMoods();
            }}
          >
            <Text style={styles.linkText}>
              {language === 'id' ? '+ 20 Emosi' : '+ All 20'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodScroll}
        >
          {PRIMARY_HOME_EMOTIONS.map((item) => {
            const isSelected = todayMood?.mood === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.moodItem,
                  isSelected && styles.moodItemSelected,
                  isNight && { backgroundColor: isSelected ? 'rgba(75, 123, 107, 0.4)' : PALETTE.nightCardSecondary },
                ]}
                onPress={() => {
                  HapticsService.selection();
                  onQuickMood(item.id);
                }}
                activeOpacity={0.7}
              >
                <Image source={item.image} style={styles.moodImg} resizeMode="contain" />
                <Text
                  style={[
                    styles.moodLabel,
                    isNight && { color: PALETTE.nightInkSecondary },
                    isSelected && styles.moodLabelSelected,
                  ]}
                >
                  {item.label[language]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Today's Mindful Reflection Card */}
      <View style={[styles.promptCard, isNight && styles.nightPromptCard]}>
        <View style={styles.promptHeader}>
          <Sparkles size={16} color="#B85330" />
          <Text style={styles.promptCategory}>
            {language === 'id' ? 'REFLEKSI HARI INI' : 'TODAYS REFLECTION'}
          </Text>
        </View>
        <Text style={[styles.promptQuestion, isNight && { color: PALETTE.nightInk }]}>
          {language === 'id'
            ? '“Apa satu beban yang sebenarnya tidak perlu kamu pikul hari ini?”'
            : '“What is one expectation you are carrying today that you can gently set down?”'}
        </Text>
        <TouchableOpacity
          style={styles.promptBtn}
          onPress={() => {
            HapticsService.light();
            onOpenWrite(
              'freeflow',
              language === 'id'
                ? 'Apa satu beban yang sebenarnya tidak perlu kamu pikul hari ini?'
                : 'What is one expectation you are carrying today that you can gently set down?'
            );
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.promptBtnText}>
            {language === 'id' ? 'Tulis Jawaban' : 'Write Response'}
          </Text>
          <ArrowRight size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* 4. Latest Reflections Shelf */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isNight && { color: PALETTE.nightInk }]}>
            {language === 'id' ? 'Catatan Terbaru' : 'Recent Reflections'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              HapticsService.light();
              onGoToNotebook();
            }}
          >
            <Text style={styles.linkText}>
              {language === 'id' ? 'Lihat Semua' : 'View Shelf'}
            </Text>
          </TouchableOpacity>
        </View>

        {journals.slice(0, 3).map((entry) => {
          const emotion = ALL_EMOTIONS.find((e) => e.id === entry.mood);
          const dateStr = new Date(entry.createdAt).toLocaleDateString(
            language === 'id' ? 'id-ID' : 'en-US',
            { day: 'numeric', month: 'short' }
          );

          return (
            <TouchableOpacity
              key={entry.id}
              style={[styles.entryCard, isNight && styles.nightCard]}
              onPress={() => {
                HapticsService.light();
                onOpenReader(entry);
              }}
              activeOpacity={0.8}
            >
              <View style={styles.entryHeader}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{dateStr}</Text>
                </View>
                {emotion && (
                  <Image source={emotion.image} style={styles.entryMoodImg} resizeMode="contain" />
                )}
              </View>

              <Text style={[styles.entryTitle, isNight && { color: PALETTE.nightInk }]} numberOfLines={1}>
                {entry.title}
              </Text>
              <Text style={[styles.entrySnippet, isNight && { color: PALETTE.nightInkSecondary }]} numberOfLines={2}>
                {entry.content}
              </Text>

              {entry.affirmationNote && (
                <View style={styles.affirmationBox}>
                  <HeartHandshake size={12} color="#B85330" />
                  <Text style={styles.affirmationText} numberOfLines={1}>
                    {entry.affirmationNote}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom spacer for floating navigation dock */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  greetingSection: {
    marginBottom: 16,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSub: {
    fontSize: 12,
    color: PALETTE.inkMuted,
    fontWeight: '500',
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PALETTE.ink,
    marginTop: 2,
  },
  todayMoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  todayMoodImg: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  todayMoodText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.primary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  nightCard: {
    backgroundColor: PALETTE.nightCard,
    borderColor: PALETTE.nightBorder,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.ink,
  },
  linkText: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.primary,
  },
  moodScroll: {
    gap: 8,
  },
  moodItem: {
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 64,
  },
  moodItemSelected: {
    backgroundColor: '#DDE9E2',
    borderWidth: 1.5,
    borderColor: PALETTE.primary,
  },
  moodImg: {
    width: 38,
    height: 38,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: PALETTE.inkSecondary,
  },
  moodLabelSelected: {
    fontWeight: '700',
    color: PALETTE.primary,
  },
  promptCard: {
    backgroundColor: '#FAF5EE',
    borderColor: '#EFE7DA',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  nightPromptCard: {
    backgroundColor: '#1E2B25',
    borderColor: PALETTE.nightBorder,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  promptCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B85330',
    letterSpacing: 0.8,
  },
  promptQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: PALETTE.ink,
    lineHeight: 20,
    marginBottom: 12,
  },
  promptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: PALETTE.primary,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  promptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  recentSection: {
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: PALETTE.ink,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateBadge: {
    backgroundColor: '#263F36',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  entryMoodImg: {
    width: 24,
    height: 24,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: PALETTE.ink,
    marginBottom: 4,
  },
  entrySnippet: {
    fontSize: 12,
    color: PALETTE.inkSecondary,
    lineHeight: 18,
  },
  affirmationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    backgroundColor: '#FDF3EE',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  affirmationText: {
    fontSize: 11,
    color: '#B85330',
    fontStyle: 'italic',
  },
});
