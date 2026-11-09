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
import { Search, Sparkles, Star } from 'lucide-react-native';
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
  onOpenWrite,
  onOpenReader,
  onToggleFavorite,
}) => {
  const isNight = nightMode;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorite' | 'capsule'>('all');

  const filtered = journals.filter((entry) => {
    if (filter === 'favorite' && !entry.isFavorite) return false;
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

  return (
    <View style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}>
      {/* 1. Header & Actions */}
      <View style={[styles.header, isNight && styles.nightHeader]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, isNight && { color: PALETTE.nightInk }]}>
            {language === 'id' ? 'Buku Jurnal' : 'Notebook Shelf'}
          </Text>

          <TouchableOpacity
            style={styles.randomBtn}
            onPress={handleRandomMemory}
            activeOpacity={0.8}
          >
            <Sparkles size={14} color={PALETTE.terracotta} />
            <Text style={styles.randomBtnText}>
              {language === 'id' ? 'Kenangan Acak' : 'Random Memory'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBox, isNight && styles.nightSearchBox]}>
          <Search size={16} color={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted} />
          <TextInput
            style={[styles.searchInput, { color: isNight ? PALETTE.nightInk : PALETTE.ink }]}
            placeholder={language === 'id' ? 'Cari kata atau ingatan...' : 'Search letters...'}
            placeholderTextColor={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {[
            { id: 'all' as const, label: language === 'id' ? 'Semua' : 'All' },
            { id: 'favorite' as const, label: language === 'id' ? '⭐ Favorit' : '⭐ Starred' },
            { id: 'capsule' as const, label: language === 'id' ? '💌 Kapsul Waktu' : '💌 Capsules' },
          ].map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive,
                  isNight && { backgroundColor: isSelected ? PALETTE.botanicalHeader : PALETTE.nightCard },
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
      </View>

      {/* 2. Journal Entry List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, isNight && { color: PALETTE.nightInkMuted }]}>
              {language === 'id' ? 'Belum ada surat yang cocok.' : 'No letters found.'}
            </Text>
          </View>
        ) : (
          filtered.map((entry) => {
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
                <View style={styles.cardHeader}>
                  <View style={styles.dateTag}>
                    <Text style={styles.dateTagText}>{dayNum} {monthShort}</Text>
                  </View>

                  <View style={styles.cardHeaderRight}>
                    {emotion && (
                      <View style={styles.entryMoodPill}>
                        <Image source={emotion.image} style={styles.moodImg} resizeMode="contain" />
                        <Text style={[styles.entryMoodLabel, isNight && { color: PALETTE.nightInkSecondary }]}>
                          {emotion.label[language]}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        HapticsService.light();
                        onToggleFavorite(entry.id);
                      }}
                    >
                      <Star
                        size={17}
                        color={entry.isFavorite ? '#E8A838' : isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
                        fill={entry.isFavorite ? '#E8A838' : 'transparent'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={[styles.entryTitle, isNight && { color: PALETTE.nightInk }]} numberOfLines={1}>
                  {entry.title}
                </Text>
                <Text style={[styles.entryContent, isNight && { color: PALETTE.nightInkSecondary }]} numberOfLines={2}>
                  {entry.content}
                </Text>
              </TouchableOpacity>
            );
          })
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
  header: {
    backgroundColor: PALETTE.bg,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(38, 63, 54, 0.06)',
  },
  nightHeader: {
    backgroundColor: PALETTE.nightBg,
    borderBottomColor: PALETTE.nightBorder,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.serifSemiBold,
    color: PALETTE.ink,
  },
  randomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EFE7DA',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  randomBtnText: {
    fontSize: 11,
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.terracotta,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PALETTE.sand,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 16,
    marginBottom: 10,
  },
  nightSearchBox: {
    backgroundColor: PALETTE.nightCardSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.sansRegular,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: PALETTE.sand,
    borderRadius: 14,
  },
  filterPillActive: {
    backgroundColor: PALETTE.botanicalHeader,
  },
  filterText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.ink,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  listContent: {
    padding: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTag: {
    backgroundColor: '#263F36',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dateTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: FONTS.sansBold,
    letterSpacing: 0.5,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  entryMoodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moodImg: {
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
  entryContent: {
    fontSize: 13,
    fontFamily: FONTS.sansRegular,
    color: PALETTE.inkSecondary,
    lineHeight: 19,
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
