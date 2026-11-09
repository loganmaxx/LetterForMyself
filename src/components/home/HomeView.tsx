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
import { PALETTE, FONTS } from '../../constants/theme';
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
      ? language === 'id' ? 'Selamat pagi' : 'Good morning'
      : currentHour < 15
      ? language === 'id' ? 'Selamat siang' : 'Good afternoon'
      : currentHour < 18
      ? language === 'id' ? 'Selamat sore' : 'Good evening'
      : language === 'id' ? 'Selamat malam' : 'Quiet night';

  const todayIso = new Date().toISOString().split('T')[0];
  const todayMood = moods.find((m) => m.timestamp.startsWith(todayIso));
  const todayEmotionMeta = todayMood
    ? ALL_EMOTIONS.find((e) => e.id === todayMood.mood)
    : null;

  const dateStr = new Date().toLocaleDateString(
    language === 'id' ? 'id-ID' : 'en-US',
    { weekday: 'long', month: 'short', day: 'numeric' }
  );

  return (
    <ScrollView
      style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Botanical Forest Hero Banner (Identical to Web Sanctuary) */}
      <View style={[styles.heroBanner, isNight && styles.nightHeroBanner]}>
        <View style={styles.heroTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroDate}>{dateStr.toUpperCase()}</Text>
            <Text style={styles.heroGreeting}>
              {greeting},{' '}
              <Text style={styles.heroName}>Traveler</Text>.
            </Text>
          </View>

          {todayEmotionMeta && (
            <TouchableOpacity
              style={styles.heroMoodBadge}
              onPress={() => {
                HapticsService.light();
                onOpenAllMoods();
              }}
              activeOpacity={0.8}
            >
              <Image source={todayEmotionMeta.image} style={styles.heroMoodImg} resizeMode="contain" />
              <Text style={styles.heroMoodText}>{todayEmotionMeta.label[language]}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.heroDivider} />
        <Text style={styles.heroQuote}>
          {language === 'id'
            ? '“Kamu tidak harus terburu-buru. Tumbuhlah dengan akar yang tenang.”'
            : '“You do not have to rush. Grow with steady and calm roots.”'}
        </Text>
      </View>

      {/* 2. Slim 3D Mood Bar (Warm Sand Container) */}
      <View style={[styles.moodSection, isNight && styles.nightCard]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isNight && { color: PALETTE.nightInk }]}>
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
          <Sparkles size={15} color={PALETTE.terracotta} />
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
              {language === 'id' ? 'Buka Rak Buku' : 'View Shelf'}
            </Text>
          </TouchableOpacity>
        </View>

        {journals.slice(0, 3).map((entry) => {
          const emotion = ALL_EMOTIONS.find((e) => e.id === entry.mood);
          const d = new Date(entry.createdAt);
          const dayNum = d.getDate().toString().padStart(2, '0');
          const monthShort = d
            .toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { month: 'short' })
            .toUpperCase();

          return (
            <TouchableOpacity
              key={entry.id}
              style={[styles.entryCard, isNight && styles.nightCard]}
              onPress={() => {
                HapticsService.light();
                onOpenReader(entry);
              }}
              activeOpacity={0.85}
            >
              <View style={styles.entryHeader}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>{dayNum} {monthShort}</Text>
                </View>
                {emotion && (
                  <View style={styles.entryMoodPill}>
                    <Image source={emotion.image} style={styles.entryMoodImg} resizeMode="contain" />
                    <Text style={[styles.entryMoodLabel, isNight && { color: PALETTE.nightInkSecondary }]}>
                      {emotion.label[language]}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.entryTitle, isNight && { color: PALETTE.nightInk }]} numberOfLines={1}>
                {entry.title}
              </Text>
              <Text style={[styles.entrySnippet, isNight && { color: PALETTE.nightInkSecondary }]} numberOfLines={2}>
                {entry.content}
              </Text>

              {entry.affirmationNote && (
                <View style={[styles.affirmationBox, isNight && { backgroundColor: PALETTE.nightCardSecondary }]}>
                  <HeartHandshake size={14} color={PALETTE.terracotta} />
                  <Text style={styles.affirmationText} numberOfLines={1}>
                    "{entry.affirmationNote}"
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 110 }} />
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
    paddingTop: 8,
  },
  heroBanner: {
    backgroundColor: PALETTE.botanicalHeader,
    borderRadius: 26,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#172722',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  nightHeroBanner: {
    backgroundColor: PALETTE.nightBotanical,
    borderWidth: 1,
    borderColor: PALETTE.nightBorder,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroDate: {
    fontSize: 10,
    fontFamily: FONTS.sansBold,
    color: '#A3C4B6',
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  heroGreeting: {
    fontSize: 24,
    fontFamily: FONTS.serifRegular,
    color: '#F2ECE1',
    letterSpacing: -0.3,
  },
  heroName: {
    fontFamily: FONTS.serifItalic,
    color: '#F5D089',
  },
  heroMoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 6,
  },
  heroMoodImg: {
    width: 24,
    height: 24,
  },
  heroMoodText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: '#F2ECE1',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 12,
  },
  heroQuote: {
    fontSize: 12,
    fontFamily: FONTS.serifItalic,
    color: 'rgba(242, 236, 225, 0.85)',
    lineHeight: 18,
  },
  moodSection: {
    backgroundColor: PALETTE.sand,
    borderRadius: 22,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(38, 63, 54, 0.06)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.sansBold,
    color: PALETTE.ink,
  },
  linkText: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.botanicalHeader,
  },
  moodScroll: {
    gap: 8,
  },
  moodItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    minWidth: 64,
  },
  moodItemSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: PALETTE.botanicalHeader,
  },
  moodImg: {
    width: 38,
    height: 38,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkSecondary,
  },
  moodLabelSelected: {
    fontFamily: FONTS.sansBold,
    color: PALETTE.botanicalHeader,
  },
  promptCard: {
    backgroundColor: '#FAF5EE',
    borderColor: '#EFE7DA',
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  nightPromptCard: {
    backgroundColor: '#1C2722',
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
    fontFamily: FONTS.sansBold,
    color: PALETTE.terracotta,
    letterSpacing: 1.2,
  },
  promptQuestion: {
    fontSize: 16,
    fontFamily: FONTS.serifMedium,
    color: PALETTE.ink,
    lineHeight: 22,
    marginBottom: 14,
  },
  promptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: PALETTE.botanicalHeader,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  promptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: FONTS.sansSemiBold,
  },
  recentSection: {
    marginTop: 4,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: PALETTE.border,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  nightCard: {
    backgroundColor: PALETTE.nightCard,
    borderColor: PALETTE.nightBorder,
    borderWidth: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateBadge: {
    backgroundColor: '#263F36',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dateBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: FONTS.sansBold,
    letterSpacing: 0.5,
  },
  entryMoodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  entryMoodImg: {
    width: 20,
    height: 20,
  },
  entryMoodLabel: {
    fontSize: 10,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkMuted,
  },
  entryTitle: {
    fontSize: 17,
    fontFamily: FONTS.serifSemiBold,
    color: PALETTE.ink,
    marginBottom: 4,
  },
  entrySnippet: {
    fontSize: 13,
    fontFamily: FONTS.sansRegular,
    color: PALETTE.inkSecondary,
    lineHeight: 19,
  },
  affirmationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: '#FDF3EE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  affirmationText: {
    fontSize: 16,
    fontFamily: FONTS.handwriting,
    color: PALETTE.terracotta,
  },
});
