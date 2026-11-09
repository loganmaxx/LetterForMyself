import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { JournalEntry, Language, MoodCheckIn, MoodType } from '../../types';
import { ALL_EMOTIONS } from '../../constants/emotions';
import { PALETTE, FONTS } from '../../constants/theme';

interface InsightsViewProps {
  language: Language;
  nightMode: boolean;
  journals: JournalEntry[];
  moods: MoodCheckIn[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  language,
  nightMode,
  journals,
  moods,
}) => {
  const isNight = nightMode;

  // Calculate mood counts
  const moodCounts: Partial<Record<MoodType, number>> = {};
  journals.forEach((j) => {
    moodCounts[j.mood] = (moodCounts[j.mood] || 0) + 1;
  });
  moods.forEach((m) => {
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });

  const sortedMoods = (Object.keys(moodCounts) as MoodType[]).sort(
    (a, b) => (moodCounts[b] || 0) - (moodCounts[a] || 0)
  );

  return (
    <ScrollView
      style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isNight && { color: PALETTE.nightInk }]}>
          {language === 'id' ? 'Wawasan & Cuaca Batin' : 'Inner Weather Insights'}
        </Text>
        <Text style={[styles.subtitle, isNight && { color: PALETTE.nightInkMuted }]}>
          {language === 'id' ? 'Pola emosi dan kebiasaan menulis santaimu' : 'Your mindful journaling habits'}
        </Text>
      </View>

      {/* 1. Quick Stats Strip */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, isNight && styles.nightCard]}>
          <Text style={styles.statNum}>{journals.length}</Text>
          <Text style={[styles.statLabel, isNight && { color: PALETTE.nightInkMuted }]}>
            {language === 'id' ? 'Surat Ditulis' : 'Letters Written'}
          </Text>
        </View>

        <View style={[styles.statCard, isNight && styles.nightCard]}>
          <Text style={[styles.statNum, { color: PALETTE.terracotta }]}>{moods.length}</Text>
          <Text style={[styles.statLabel, isNight && { color: PALETTE.nightInkMuted }]}>
            {language === 'id' ? 'Cek Emosi' : 'Mood Logs'}
          </Text>
        </View>

        <View style={[styles.statCard, isNight && styles.nightCard]}>
          <Text style={[styles.statNum, { color: PALETTE.amberwarm }]}>4</Text>
          <Text style={[styles.statLabel, isNight && { color: PALETTE.nightInkMuted }]}>
            {language === 'id' ? 'Hari Berturut' : 'Day Streak'}
          </Text>
        </View>
      </View>

      {/* 2. Top Emotions Overview */}
      <View style={[styles.card, isNight && styles.nightCard]}>
        <View style={styles.cardHeader}>
          <Sparkles size={16} color={PALETTE.terracotta} />
          <Text style={[styles.cardTitle, isNight && { color: PALETTE.nightInk }]}>
            {language === 'id' ? 'Emosi Paling Sering Dirasakan' : 'Most Frequent Emotions'}
          </Text>
        </View>

        {sortedMoods.length === 0 ? (
          <Text style={[styles.emptyText, isNight && { color: PALETTE.nightInkMuted }]}>
            {language === 'id' ? 'Belum ada data emosi yang tersimpan.' : 'No mood logs yet.'}
          </Text>
        ) : (
          <View style={styles.moodList}>
            {sortedMoods.slice(0, 5).map((mKey) => {
              const emo = ALL_EMOTIONS.find((e) => e.id === mKey);
              if (!emo) return null;
              const count = moodCounts[mKey] || 0;

              return (
                <View key={mKey} style={styles.moodStatRow}>
                  <View style={styles.moodStatLeft}>
                    <Image source={emo.image} style={styles.moodStatImg} resizeMode="contain" />
                    <Text style={[styles.moodStatName, isNight && { color: PALETTE.nightInk }]}>
                      {emo.label[language]}
                    </Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count}x</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* 3. Botanical Encouragement */}
      <View style={[styles.quoteCard, isNight && styles.nightQuoteCard]}>
        <Text style={styles.quoteTitle}>🌱 {language === 'id' ? 'Pengingat Jiwa' : 'Gentle Reminder'}</Text>
        <Text style={styles.quoteBody}>
          {language === 'id'
            ? 'Setiap perasaan itu valid. Kamu tidak harus selalu bahagia untuk merasa cukup. Terus rawat batinmu dengan penuh kelembutan.'
            : 'Every emotion is valid. You do not have to always be happy to be enough. Keep tending to your inner garden with patience.'}
        </Text>
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
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.serifSemiBold,
    color: PALETTE.ink,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkMuted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  nightCard: {
    backgroundColor: PALETTE.nightCard,
    borderColor: PALETTE.nightBorder,
    borderWidth: 1,
  },
  statNum: {
    fontSize: 24,
    fontFamily: FONTS.serifSemiBold,
    color: PALETTE.botanicalHeader,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: FONTS.sansBold,
    color: PALETTE.inkMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: FONTS.sansBold,
    color: PALETTE.ink,
  },
  moodList: {
    gap: 10,
  },
  moodStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  moodStatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moodStatImg: {
    width: 32,
    height: 32,
  },
  moodStatName: {
    fontSize: 13,
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.ink,
  },
  countBadge: {
    backgroundColor: PALETTE.sand,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.ink,
  },
  quoteCard: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EFE7DA',
    borderRadius: 22,
    padding: 18,
  },
  nightQuoteCard: {
    backgroundColor: '#1E2B25',
    borderColor: PALETTE.nightBorder,
  },
  quoteTitle: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.botanicalHeader,
    marginBottom: 6,
  },
  quoteBody: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: FONTS.serifItalic,
    color: PALETTE.inkSecondary,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: FONTS.sansRegular,
    color: PALETTE.inkMuted,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
