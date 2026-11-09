import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Search, Sparkles, Star, Lock } from 'lucide-react-native';
import { JournalEntry, Language } from '../../types';
import { ALL_EMOTIONS } from '../../constants/emotions';
import { PALETTE, FONTS } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';

interface NotebookViewProps {
  language: Language;
  nightMode: boolean;
  journals: JournalEntry[];
  onOpenWrite: () => void;
  onOpenReader: (entry: JournalEntry) => void;
  onToggleFavorite: (id: string) => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  language,
  nightMode,
  journals,
  onOpenReader,
  onToggleFavorite,
}) => {
  const isNight = nightMode;
  const lang = language;

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorite' | 'cbt' | 'capsule'>('all');

  const nowStr = new Date().toISOString().split('T')[0];

  const filtered = journals.filter((entry) => {
    if (filter === 'favorite' && !entry.isFavorite) return false;
    if (filter === 'cbt' && entry.template !== 'cbt') return false;
    if (filter === 'capsule' && entry.template !== 'capsule') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRandomMemory = () => {
    HapticsService.medium();
    if (journals.length === 0) return;
    const randomIndex = Math.floor(Math.random() * journals.length);
    onOpenReader(journals[randomIndex]);
  };

  const tabs = [
    { id: 'all' as const, label: lang === 'id' ? 'Semua' : 'All' },
    { id: 'favorite' as const, label: lang === 'id' ? '⭐ Favorit' : '⭐ Starred' },
    { id: 'cbt' as const, label: '🌱 CBT' },
    { id: 'capsule' as const, label: lang === 'id' ? '💌 Kapsul' : '💌 Capsules' },
  ];

  return (
    <View style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 1. Solid Botanical Header Banner */}
        <View style={[styles.heroBanner, isNight && styles.nightHeroBanner]}>
          <View>
            <Text style={styles.bannerSubtitle}>
              {lang === 'id' ? 'ARSIP PRIBADI' : 'PERSONAL ARCHIVE'}
            </Text>
            <Text style={styles.bannerTitle}>
              {lang === 'id' ? 'Jurnal Saya' : 'My Journal'}
            </Text>
          </View>

          <View style={styles.bannerActions}>
            {journals.length > 1 && (
              <TouchableOpacity
                style={styles.randomBtn}
                onPress={handleRandomMemory}
                activeOpacity={0.8}
              >
                <Sparkles size={13} color="#FFFFFF" />
                <Text style={styles.randomBtnText}>
                  {lang === 'id' ? 'Kenangan Acak' : 'Random Memory'}
                </Text>
              </TouchableOpacity>
            )}
            <View style={styles.entryCountBadge}>
              <Text style={styles.entryCountText}>
                {filtered.length} {lang === 'id' ? 'Catatan' : 'Entries'}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Search & Segmented Filter Pills */}
        <View style={[styles.searchBox, isNight && styles.nightSearchBox]}>
          <Search size={16} color={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted} />
          <TextInput
            style={[styles.searchInput, { color: isNight ? PALETTE.nightInk : PALETTE.ink }]}
            placeholder={lang === 'id' ? 'Cari kata atau ingatan...' : 'Search reflections...'}
            placeholderTextColor={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={[styles.filterContainer, isNight && styles.nightFilterContainer]}>
          {tabs.map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                  isSelected && isNight && { backgroundColor: PALETTE.botanicalHeader },
                ]}
                onPress={() => {
                  HapticsService.selection();
                  setFilter(tab.id);
                }}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextActive,
                    isNight && !isSelected && { color: PALETTE.nightInkSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. Journal Entry List */}
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, isNight && { color: PALETTE.nightInkMuted }]}>
              {lang === 'id' ? 'Belum ada surat yang cocok.' : 'No letters found in this view.'}
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((entry) => {
              const emotion = ALL_EMOTIONS.find((e) => e.id === entry.mood);
              const d = new Date(entry.createdAt);
              const dayNum = String(d.getDate()).padStart(2, '0');
              const monthShort = d
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
                  {/* Solid Tinted Date Badge */}
                  <View style={[styles.dateBadge, isNight && { backgroundColor: PALETTE.nightCardSecondary }]}>
                    <Text style={[styles.dateDay, isNight && { color: PALETTE.nightInk }]}>
                      {dayNum}
                    </Text>
                    <Text style={[styles.dateMonth, isNight && { color: '#88B7A1' }]}>
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
                      <View style={styles.capsuleRow}>
                        <Lock size={12} color={PALETTE.terracotta} />
                        <Text style={styles.capsuleText}>
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

                  {/* Right: 3D Emotion & Star Favorite */}
                  <View style={styles.cardRight}>
                    {emotion && (
                      <Image source={emotion.image} style={styles.moodImg} resizeMode="contain" />
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        HapticsService.light();
                        onToggleFavorite(entry.id);
                      }}
                      style={styles.starBtn}
                    >
                      <Star
                        size={16}
                        color={entry.isFavorite ? '#E8A838' : isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
                        fill={entry.isFavorite ? '#E8A838' : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  heroBanner: {
    backgroundColor: '#1F382B',
    borderRadius: 26,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#172722',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  nightHeroBanner: {
    backgroundColor: '#16231E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bannerSubtitle: {
    fontSize: 10,
    fontFamily: FONTS.sansBold,
    color: '#C5DBD0',
    letterSpacing: 2,
    marginBottom: 2,
  },
  bannerTitle: {
    fontSize: 24,
    fontFamily: FONTS.serifRegular,
    color: '#FAF6F0',
    letterSpacing: -0.3,
  },
  bannerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  randomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: PALETTE.terracotta,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: PALETTE.terracotta,
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 2,
  },
  randomBtnText: {
    fontSize: 11,
    fontFamily: FONTS.sansSemiBold,
    color: '#FFFFFF',
  },
  entryCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  entryCountText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: '#E3EDE6',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#2A2421',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  nightSearchBox: {
    backgroundColor: PALETTE.nightCard,
    borderColor: PALETTE.nightBorder,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.sansRegular,
    paddingVertical: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6DEC8',
    borderRadius: 20,
    padding: 3,
    justifyContent: 'space-between',
  },
  nightFilterContainer: {
    backgroundColor: PALETTE.nightCardSecondary,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  filterPillActive: {
    backgroundColor: '#1F332C',
  },
  filterText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: '#544943',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  list: {
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
  nightCard: {
    backgroundColor: PALETTE.nightCard,
    borderColor: PALETTE.nightBorder,
  },
  dateBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E3EDE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDay: {
    fontSize: 16,
    fontFamily: FONTS.serifSemiBold,
    color: '#1F332C',
    lineHeight: 18,
  },
  dateMonth: {
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
    fontSize: 15,
    fontFamily: FONTS.serifMedium,
    color: '#2A2421',
    marginBottom: 2,
  },
  entryExcerpt: {
    fontSize: 12,
    fontFamily: FONTS.sansRegular,
    color: '#8C7E75',
  },
  capsuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capsuleText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.terracotta,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodImg: {
    width: 26,
    height: 26,
  },
  starBtn: {
    padding: 4,
  },
  emptyBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontFamily: FONTS.sansRegular,
    color: PALETTE.inkMuted,
  },
});
