import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Feather,
  Lock,
  Unlock,
  Check,
} from 'lucide-react-native';
import { JournalEntry, Language, MoodCheckIn, MoodType, TemplateType } from '../../types';
import { ALL_EMOTIONS, PRIMARY_HOME_EMOTIONS } from '../../constants/emotions';
import { PALETTE, FONTS } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';
import { DAILY_QUOTES, GUIDED_PROMPTS } from '../../data/bilingualData';

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
  const lang = language;

  const [promptIdx, setPromptIdx] = useState<number>(
    () => new Date().getDate() % GUIDED_PROMPTS.length
  );
  const [justLoggedMood, setJustLoggedMood] = useState<MoodType | null>(null);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 11
      ? lang === 'id' ? 'Selamat pagi' : 'Good morning'
      : currentHour < 15
      ? lang === 'id' ? 'Selamat siang' : 'Good afternoon'
      : currentHour < 18
      ? lang === 'id' ? 'Selamat sore' : 'Good evening'
      : lang === 'id' ? 'Selamat malam' : 'Quiet night';

  const todayIso = new Date().toISOString().split('T')[0];
  const nowStr = todayIso;
  const latestMood = moods[0]?.mood ? ALL_EMOTIONS.find((e) => e.id === moods[0].mood) : null;
  const todayMood = moods.find((m) => m.timestamp.startsWith(todayIso));
  const activeMoodMeta = latestMood || ALL_EMOTIONS[1]; // default Peaceful

  const quoteIndex = new Date().getDate() % DAILY_QUOTES.length;
  const dailyQuote = DAILY_QUOTES[quoteIndex];
  const currentPrompt = GUIDED_PROMPTS[promptIdx] || GUIDED_PROMPTS[0];

  const dateStr = new Date().toLocaleDateString(
    lang === 'id' ? 'id-ID' : 'en-US',
    { weekday: 'long', month: 'short', day: 'numeric' }
  );

  const readyCapsules = journals.filter(
    (j) =>
      j.template === 'capsule' &&
      !j.isUnlocked &&
      !!j.unlockDate &&
      j.unlockDate <= nowStr
  );
  const upcomingCapsules = journals.filter(
    (j) =>
      j.template === 'capsule' &&
      !j.isUnlocked &&
      !!j.unlockDate &&
      j.unlockDate > nowStr
  );

  const handleQuickMoodClick = (moodId: MoodType) => {
    HapticsService.selection();
    setJustLoggedMood(moodId);
    onQuickMood(moodId);
    setTimeout(() => setJustLoggedMood(null), 2500);
  };

  const handleShufflePrompt = () => {
    HapticsService.light();
    setPromptIdx((prev) => (prev + 1) % GUIDED_PROMPTS.length);
  };

  return (
    <ScrollView
      style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Dynamic Time-of-Day Hero Card + Today's Mood Companion Badge */}
      <View style={[styles.heroBanner, isNight && styles.nightHeroBanner]}>
        <View style={styles.heroTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroDate}>{dateStr.toUpperCase()}</Text>
            <Text style={styles.heroGreeting}>
              {greeting},{' '}
              <Text style={styles.heroName}>Traveler</Text>.
            </Text>
          </View>

          {/* Today's 3D Mood Companion Badge */}
          <TouchableOpacity
            style={styles.heroMoodBadge}
            onPress={() => {
              HapticsService.light();
              onOpenAllMoods();
            }}
            activeOpacity={0.8}
          >
            <Image source={activeMoodMeta.image} style={styles.heroMoodImg} resizeMode="contain" />
            <Text style={styles.heroMoodText}>{activeMoodMeta.label[lang]}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroDivider} />
        <Text style={styles.heroQuote}>
          “{dailyQuote.text[lang]}”
        </Text>
      </View>

      {/* 2. Quick 1-Row Mood Check-In (Authentic Warm Sand Container) */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionSubtitle, isNight && { color: PALETTE.nightInkMuted }]}>
          {lang === 'id' ? 'BAGAIMANA PERASAANMU SAAT INI?' : 'HOW DOES YOUR HEART FEEL?'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            HapticsService.light();
            onOpenAllMoods();
          }}
        >
          <Text style={[styles.moreEmotionsText, isNight && { color: '#88B7A1' }]}>
            {lang === 'id' ? '+ Emosi lainnya' : '+ More emotions'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.moodSandContainer, isNight && styles.nightMoodContainer]}>
        {justLoggedMood ? (
          <View style={styles.savedMoodBanner}>
            <Check size={14} color="#263F36" strokeWidth={2.5} />
            <Text style={styles.savedMoodText}>
              {lang === 'id'
                ? `Perasaan "${ALL_EMOTIONS.find((e) => e.id === justLoggedMood)?.label.id}" tersimpan`
                : `Saved "${ALL_EMOTIONS.find((e) => e.id === justLoggedMood)?.label.en}"`}
            </Text>
          </View>
        ) : (
          <View style={styles.moodGridRow}>
            {PRIMARY_HOME_EMOTIONS.map((item) => {
              const isSelected = (todayMood?.mood || moods[0]?.mood) === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.moodCol,
                    isSelected && styles.moodColSelected,
                    isSelected && isNight && { backgroundColor: 'rgba(75, 123, 107, 0.45)' },
                  ]}
                  onPress={() => handleQuickMoodClick(item.id)}
                  activeOpacity={0.7}
                >
                  <Image source={item.image} style={styles.moodColImg} resizeMode="contain" />
                  <Text
                    style={[
                      styles.moodColLabel,
                      isSelected && styles.moodColLabelSelected,
                      isNight && !isSelected && { color: PALETTE.nightInkSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {item.label[lang]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* 3. Daily Reflection Prompt Card */}
      <View style={[styles.promptCard, isNight && styles.nightCard]}>
        <View style={styles.promptHeader}>
          <View style={styles.promptHeaderLeft}>
            <Sparkles size={14} color={PALETTE.terracotta} />
            <Text style={styles.promptCategory}>
              {lang === 'id' ? 'PERTANYAAN REFLEKSI HARI INI' : "TODAY'S REFLECTION PROMPT"}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.shuffleBtn, isNight && styles.nightShuffleBtn]}
            onPress={handleShufflePrompt}
            activeOpacity={0.75}
          >
            <RefreshCw size={11} color={isNight ? PALETTE.nightInkMuted : PALETTE.inkSecondary} />
            <Text style={[styles.shuffleText, isNight && { color: PALETTE.nightInkMuted }]}>
              {lang === 'id' ? 'Ganti' : 'Shuffle'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.promptQuestion, isNight && { color: PALETTE.nightInk }]}>
          “{currentPrompt[lang]}”
        </Text>

        <View style={styles.promptActionRow}>
          <TouchableOpacity
            style={styles.answerBtn}
            onPress={() => {
              HapticsService.light();
              onOpenWrite('freeflow', currentPrompt[lang]);
            }}
            activeOpacity={0.85}
          >
            <Feather size={14} color="#FFFFFF" strokeWidth={2.2} />
            <Text style={styles.answerBtnText}>
              {lang === 'id' ? 'Tulis Jawaban di Jurnal' : 'Answer in Journal'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. Guided Templates Card: "What would you like to set down on paper today?" */}
      <View style={[styles.guidedCard, isNight && styles.nightCard]}>
        <Text style={[styles.guidedHeading, isNight && { color: PALETTE.nightInk }]}>
          {lang === 'id'
            ? 'Apa yang ingin kamu tuangkan ke kertas hari ini?'
            : 'What would you like to set down on paper today?'}
        </Text>

        <TouchableOpacity
          style={styles.startWritingBtn}
          onPress={() => {
            HapticsService.light();
            onOpenWrite('freeflow');
          }}
          activeOpacity={0.85}
        >
          <Feather size={15} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.startWritingBtnText}>
            {lang === 'id' ? 'Mulai Menulis Bebas' : 'Start Writing Freely'}
          </Text>
        </TouchableOpacity>

        <View style={styles.templatePillsRow}>
          {[
            { id: 'cbt' as TemplateType, label: '🌱 Reframe Thought (CBT)' },
            { id: 'unload' as TemplateType, label: '🍃 Brain Dump' },
            { id: 'freeflow' as TemplateType, label: '☀️ Morning Note' },
            { id: 'capsule' as TemplateType, label: '💌 Future Letter' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.templateSubPill, isNight && styles.nightTemplatePill]}
              onPress={() => {
                HapticsService.selection();
                onOpenWrite(item.id);
              }}
              activeOpacity={0.75}
            >
              <Text style={[styles.templateSubPillText, isNight && { color: PALETTE.nightInk }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 5. Time Capsule Alert (if any) */}
      {readyCapsules.length > 0 ? (
        <TouchableOpacity
          style={styles.capsuleReadyCard}
          onPress={() => onOpenReader(readyCapsules[0])}
          activeOpacity={0.85}
        >
          <View style={styles.capsuleIconBox}>
            <Unlock size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.capsuleReadyLabel}>
              {lang === 'id' ? 'KAPSUL WAKTU SIAP DIBUKA!' : 'TIME CAPSULE READY!'}
            </Text>
            <Text style={styles.capsuleReadyTitle} numberOfLines={1}>
              {readyCapsules[0].title}
            </Text>
          </View>
          <View style={styles.capsuleOpenBadge}>
            <Text style={styles.capsuleOpenText}>
              {lang === 'id' ? 'Buka' : 'Open'}
            </Text>
          </View>
        </TouchableOpacity>
      ) : upcomingCapsules.length > 0 ? (
        <TouchableOpacity
          style={[styles.capsuleUpcomingCard, isNight && styles.nightCard]}
          onPress={() => onOpenReader(upcomingCapsules[0])}
          activeOpacity={0.85}
        >
          <Lock size={14} color={PALETTE.terracotta} />
          <Text style={[styles.capsuleUpcomingText, isNight && { color: PALETTE.nightInk }]} numberOfLines={1}>
            {lang === 'id'
              ? `${upcomingCapsules.length} Kapsul Waktu tersegel (${upcomingCapsules[0].unlockDate})`
              : `${upcomingCapsules.length} Time Capsule sealed (${upcomingCapsules[0].unlockDate})`}
          </Text>
          <ArrowRight size={13} color={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted} />
        </TouchableOpacity>
      ) : null}

      {/* 6. Latest Pages (Recent Reflections) */}
      {journals.length > 0 && (
        <View style={styles.latestSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionSubtitle, isNight && { color: PALETTE.nightInkMuted }]}>
              {lang === 'id' ? 'CATATAN TERAKHIR' : 'LATEST PAGES'}
            </Text>
            <TouchableOpacity onPress={onGoToNotebook} style={styles.viewAllRow}>
              <Text style={[styles.moreEmotionsText, isNight && { color: '#88B7A1' }]}>
                {lang === 'id'
                  ? `Lihat semua (${journals.length})`
                  : `All ${journals.length} entries`}
              </Text>
              <ArrowRight size={12} color={isNight ? '#88B7A1' : PALETTE.botanicalHeader} />
            </TouchableOpacity>
          </View>

          <View style={styles.latestList}>
            {journals.slice(0, 3).map((entry) => {
              const emotion = ALL_EMOTIONS.find((e) => e.id === entry.mood);
              const dateObj = new Date(entry.createdAt);
              const dayNum = String(dateObj.getDate()).padStart(2, '0');
              const monthShort = dateObj
                .toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { month: 'short' })
                .toUpperCase();
              const isSealed =
                entry.template === 'capsule' &&
                !entry.isUnlocked &&
                !!entry.unlockDate &&
                entry.unlockDate > nowStr;

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
                  {/* Solid Tinted Sage Date Badge */}
                  <View style={[styles.entryDateBadge, isNight && { backgroundColor: PALETTE.nightCardSecondary }]}>
                    <Text style={[styles.entryDateDay, isNight && { color: PALETTE.nightInk }]}>
                      {dayNum}
                    </Text>
                    <Text style={[styles.entryDateMonth, isNight && { color: '#88B7A1' }]}>
                      {monthShort}
                    </Text>
                  </View>

                  {/* Title & Excerpt */}
                  <View style={styles.entryBody}>
                    <Text
                      style={[styles.entryTitle, isNight && { color: PALETTE.nightInk }]}
                      numberOfLines={1}
                    >
                      {entry.title}
                    </Text>
                    {isSealed ? (
                      <View style={styles.capsuleTagRow}>
                        <Lock size={12} color={PALETTE.terracotta} />
                        <Text style={styles.capsuleTagText}>
                          {lang === 'id'
                            ? `Kapsul waktu (${entry.unlockDate})`
                            : `Time capsule (${entry.unlockDate})`}
                        </Text>
                      </View>
                    ) : (
                      <Text
                        style={[styles.entryExcerpt, isNight && { color: PALETTE.nightInkSecondary }]}
                        numberOfLines={1}
                      >
                        {entry.content}
                      </Text>
                    )}
                  </View>

                  {/* 3D Emotion Icon */}
                  {emotion && (
                    <Image source={emotion.image} style={styles.entryMoodImg} resizeMode="contain" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Bottom Spacer for floating dock */}
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
    gap: 14,
  },
  heroBanner: {
    backgroundColor: '#1F382B',
    borderRadius: 28,
    padding: 22,
    shadowColor: '#172722',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  nightHeroBanner: {
    backgroundColor: '#16231E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  heroDate: {
    fontSize: 10,
    fontFamily: FONTS.sansBold,
    color: '#C5DBD0',
    letterSpacing: 2,
    marginBottom: 4,
  },
  heroGreeting: {
    fontSize: 25,
    fontFamily: FONTS.serifRegular,
    color: '#FAF6F0',
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  heroName: {
    fontFamily: FONTS.serifItalic,
    color: '#FAE5B8',
  },
  heroMoodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 18,
    gap: 6,
  },
  heroMoodImg: {
    width: 22,
    height: 22,
  },
  heroMoodText: {
    fontSize: 12,
    fontFamily: FONTS.sansMedium,
    color: '#FAF6F0',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 14,
    marginBottom: 12,
  },
  heroQuote: {
    fontSize: 13,
    fontFamily: FONTS.serifItalic,
    color: 'rgba(227, 237, 230, 0.9)',
    lineHeight: 19,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginTop: 2,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: '#6E6259',
    letterSpacing: 1.2,
  },
  moreEmotionsText: {
    fontSize: 12,
    fontFamily: FONTS.sansSemiBold,
    color: '#2F4F43',
  },
  moodSandContainer: {
    backgroundColor: '#E8E0D2',
    borderRadius: 22,
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
  },
  nightMoodContainer: {
    backgroundColor: PALETTE.nightCard,
    borderColor: PALETTE.nightBorder,
  },
  savedMoodBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  savedMoodText: {
    fontSize: 12,
    fontFamily: FONTS.sansMedium,
    color: '#263F36',
  },
  moodGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 16,
    opacity: 0.82,
  },
  moodColSelected: {
    backgroundColor: '#FFFFFF',
    opacity: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  moodColImg: {
    width: 27,
    height: 27,
    marginBottom: 3,
  },
  moodColLabel: {
    fontSize: 10,
    fontFamily: FONTS.sansMedium,
    color: '#544943',
    textAlign: 'center',
  },
  moodColLabelSelected: {
    fontFamily: FONTS.sansBold,
    color: '#2A2421',
  },
  promptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#2A2421',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promptCategory: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.terracotta,
    letterSpacing: 1.2,
  },
  shuffleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F4EDE2',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  nightShuffleBtn: {
    backgroundColor: PALETTE.nightCardSecondary,
  },
  shuffleText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkSecondary,
  },
  promptQuestion: {
    fontSize: 18,
    fontFamily: FONTS.serifRegular,
    color: '#2A2421',
    lineHeight: 25,
  },
  promptActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#263F36',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#263F36',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  answerBtnText: {
    fontSize: 12,
    fontFamily: FONTS.sansSemiBold,
    color: '#FFFFFF',
  },
  guidedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#2A2421',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
    gap: 12,
  },
  guidedHeading: {
    fontSize: 17,
    fontFamily: FONTS.serifRegular,
    color: '#2A2421',
    textAlign: 'center',
  },
  startWritingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#263F36',
    paddingVertical: 11,
    paddingHorizontal: 22,
    borderRadius: 24,
    shadowColor: '#263F36',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  startWritingBtnText: {
    fontSize: 13,
    fontFamily: FONTS.sansSemiBold,
    color: '#FFFFFF',
  },
  templatePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 2,
  },
  templateSubPill: {
    backgroundColor: '#FAF6F0',
    borderWidth: 1,
    borderColor: '#E5DEC9',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 11,
  },
  nightTemplatePill: {
    backgroundColor: PALETTE.nightCardSecondary,
    borderColor: PALETTE.nightBorder,
  },
  templateSubPillText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: '#3D3530',
  },
  capsuleReadyCard: {
    backgroundColor: PALETTE.terracotta,
    borderRadius: 24,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  capsuleIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capsuleReadyLabel: {
    fontSize: 9,
    fontFamily: FONTS.sansBold,
    color: '#FBE8E1',
    letterSpacing: 1,
  },
  capsuleReadyTitle: {
    fontSize: 14,
    fontFamily: FONTS.serifMedium,
    color: '#FFFFFF',
  },
  capsuleOpenBadge: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  capsuleOpenText: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.terracotta,
  },
  capsuleUpcomingCard: {
    backgroundColor: '#E8E0D2',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capsuleUpcomingText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.sansMedium,
    color: '#3D3530',
  },
  latestSection: {
    gap: 10,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  latestList: {
    gap: 10,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 13,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#2A2421',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  entryDateBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E3EDE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryDateDay: {
    fontSize: 16,
    fontFamily: FONTS.serifSemiBold,
    color: '#1F332C',
    lineHeight: 18,
  },
  entryDateMonth: {
    fontSize: 9,
    fontFamily: FONTS.sansBold,
    color: '#2F4F43',
    letterSpacing: 0.8,
  },
  entryBody: {
    flex: 1,
    minWidth: 0,
  },
  entryTitle: {
    fontSize: 14,
    fontFamily: FONTS.serifMedium,
    color: '#2A2421',
    marginBottom: 2,
  },
  entryExcerpt: {
    fontSize: 12,
    fontFamily: FONTS.sansRegular,
    color: '#8C7E75',
  },
  capsuleTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capsuleTagText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.terracotta,
  },
  entryMoodImg: {
    width: 28,
    height: 28,
  },
  nightCard: {
    backgroundColor: PALETTE.nightCard,
    borderColor: PALETTE.nightBorder,
  },
});
