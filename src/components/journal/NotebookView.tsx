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
import { Search, Sparkles, Star, Plus } from 'lucide-react-native';
import { JournalEntry, Language } from '../../types';
import { ALL_EMOTIONS } from '../../constants/emotions';
import { PALETTE } from '../../constants/theme';
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
            <Sparkles size={14} color="#D4A373" />
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
                  isNight && { backgroundColor: isSelected ? PALETTE.primary : PALETTE.nightCard },
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
            const dateStr = new Date(entry.createdAt).toLocaleDateString(
              language === 'id' ? 'id-ID' : 'en-US',
              { day: 'numeric', month: 'short', year: 'numeric' }
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
                <View style={styles.cardHeader}>
                  <View style={styles.dateTag}>
                    <Text style={styles.dateTagText}>{dateStr}</Text>
                  </View>

                  <View style={styles.cardHeaderRight}>
                    {emotion && (
                      <Image source={emotion.image} style={styles.moodImg} resizeMode="contain" />
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        HapticsService.light();
                        onToggleFavorite(entry.id);
                      }}
                    >
                      <Star
                        size={16}
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
        <View style={{ height: 100 }} />
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  nightHeader: {
    backgroundColor: PALETTE.nightCard,
    borderBottomColor: PALETTE.nightBorder,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: PALETTE.ink,
  },
  randomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EFE7DA',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  randomBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B85330',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F0E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 10,
  },
  nightSearchBox: {
    backgroundColor: PALETTE.nightCardSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: '#F5F0E6',
    borderRadius: 14,
  },
  filterPillActive: {
    backgroundColor: PALETTE.primary,
  },
  filterText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.ink,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 8,
  },
  dateTag: {
    backgroundColor: '#263F36',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dateTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moodImg: {
    width: 22,
    height: 22,
  },
  entryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: PALETTE.ink,
    marginBottom: 4,
  },
  entryContent: {
    fontSize: 13,
    color: PALETTE.inkSecondary,
    lineHeight: 18,
  },
  emptyBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: PALETTE.inkMuted,
  },
});
