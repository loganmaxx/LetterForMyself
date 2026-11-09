import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { X, Heart, Check } from 'lucide-react-native';
import { Language, MoodType } from '../../types';
import { ALL_EMOTIONS } from '../../constants/emotions';
import { PALETTE, FONTS } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';

interface MoodPickerModalProps {
  visible: boolean;
  language: Language;
  nightMode: boolean;
  onClose: () => void;
  onSelectMood: (mood: MoodType, note: string) => void;
}

const NUANCED_FEELINGS = [
  { id: 'grateful', label: { en: 'Grateful', id: 'Bersyukur' } },
  { id: 'hopeful', label: { en: 'Hopeful', id: 'Penuh Harap' } },
  { id: 'relieved', label: { en: 'Relieved', id: 'Lega' } },
  { id: 'inspired', label: { en: 'Inspired', id: 'Terinspirasi' } },
  { id: 'loved', label: { en: 'Loved', id: 'Dicintai' } },
  { id: 'curious', label: { en: 'Curious', id: 'Ingin Tahu' } },
  { id: 'proud', label: { en: 'Quietly Proud', id: 'Bangga Tenang' } },
  { id: 'content', label: { en: 'Content', id: 'Puas' } },
  { id: 'exhausted', label: { en: 'Exhausted', id: 'Lelah Fisik' } },
  { id: 'overthinking', label: { en: 'Overthinking', id: 'Banyak Pikiran' } },
  { id: 'lonely', label: { en: 'Lonely', id: 'Kesepian' } },
  { id: 'vulnerable', label: { en: 'Vulnerable', id: 'Rentan' } },
  { id: 'frustrated', label: { en: 'Frustrated', id: 'Frustrasi' } },
  { id: 'selfdoubting', label: { en: 'Self-Doubting', id: 'Ragu Diri' } },
  { id: 'nostalgic', label: { en: 'Nostalgic', id: 'Nostalgia' } },
  { id: 'healing', label: { en: 'Slowly Healing', id: 'Perlahan Pulih' } },
];

const BODY_SENSATIONS = [
  { id: 'deepbreath', icon: '🌬️', label: { en: 'Deep, steady breath', id: 'Napas dalam & teratur' } },
  { id: 'warmchest', icon: '☀️', label: { en: 'Warmth in chest', id: 'Kehangatan di dada' } },
  { id: 'softjaw', icon: '🍃', label: { en: 'Soft shoulders & jaw', id: 'Bahu & rahang rileks' } },
  { id: 'heavyshoulders', icon: '🪨', label: { en: 'Heavy shoulders/neck', id: 'Bahu/leher tegang' } },
  { id: 'tightchest', icon: '⚡', label: { en: 'Tightness in chest', id: 'Sesak/sesekali berat' } },
  { id: 'knotstomach', icon: '🦋', label: { en: 'Knots in stomach', id: 'Perut bergejolak' } },
];

export const MoodPickerModal: React.FC<MoodPickerModalProps> = ({
  visible,
  language,
  nightMode,
  onClose,
  onSelectMood,
}) => {
  const isNight = nightMode;
  const lang = language;

  const [selectedMood, setSelectedMood] = useState<MoodType>('peaceful');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'warm' | 'calm' | 'heavy'>('all');
  const [selectedNuances, setSelectedNuances] = useState<string[]>([]);
  const [selectedSensations, setSelectedSensations] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const warmMoods: MoodType[] = ['happy', 'excited', 'grateful', 'confident', 'energetic', 'hopeful'];
  const calmMoods: MoodType[] = ['peaceful', 'calm', 'relaxed', 'content', 'safe'];
  const heavyMoods: MoodType[] = ['sad', 'anxious', 'sleepy', 'stressed', 'overwhelmed', 'lonely', 'frustrated', 'angry', 'bored'];

  const filteredEmotions = ALL_EMOTIONS.filter((emo) => {
    if (categoryFilter === 'warm') return warmMoods.includes(emo.id);
    if (categoryFilter === 'calm') return calmMoods.includes(emo.id);
    if (categoryFilter === 'heavy') return heavyMoods.includes(emo.id);
    return true;
  });

  const toggleNuance = (id: string) => {
    HapticsService.selection();
    setSelectedNuances((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSensation = (id: string) => {
    HapticsService.selection();
    setSelectedSensations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    HapticsService.success();
    // Build summary note with nuances if any
    const nuanceLabels = selectedNuances.map(
      (n) => NUANCED_FEELINGS.find((f) => f.id === n)?.label[lang]
    ).filter(Boolean);
    const sensationLabels = selectedSensations.map(
      (s) => BODY_SENSATIONS.find((b) => b.id === s)?.label[lang]
    ).filter(Boolean);

    let fullNote = note.trim();
    if (nuanceLabels.length > 0) {
      fullNote += fullNote ? ` | ${nuanceLabels.join(', ')}` : nuanceLabels.join(', ');
    }
    if (sensationLabels.length > 0) {
      fullNote += fullNote ? ` [Tubuh: ${sensationLabels.join(', ')}]` : `[Tubuh: ${sensationLabels.join(', ')}]`;
    }

    onSelectMood(selectedMood, fullNote);
    setNote('');
    setSelectedNuances([]);
    setSelectedSensations([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, isNight && styles.nightSheet]}>
          {/* Header with Terracotta Squircle Heart */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.heartBox}>
                <Heart size={20} color={PALETTE.terracotta} fill="#F6D0C2" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, isNight && { color: PALETTE.nightInk }]}>
                  {lang === 'id' ? 'Pemeriksaan Emosi & Tubuh' : 'Emotional & Somatic Check-In'}
                </Text>
                <Text style={[styles.subtitle, isNight && { color: PALETTE.nightInkMuted }]}>
                  {lang === 'id'
                    ? 'Dengarkan apa yang sedang dirasakan hati dan tubuhmu'
                    : 'Pause and listen to what your heart and nervous system are experiencing'}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={[styles.closeBtn, isNight && styles.nightCloseBtn]}>
              <X size={18} color={isNight ? PALETTE.nightInk : PALETTE.inkSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* 1. CHOOSE YOUR FEELING with Category Filters */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionHeading, isNight && { color: PALETTE.nightInkMuted }]}>
                {lang === 'id' ? '1. PILIH EMOSI UTAMAMU' : '1. CHOOSE YOUR FEELING'}
              </Text>

              <View style={[styles.filterPillsRow, isNight && styles.nightFilterPillsRow]}>
                {[
                  { id: 'all' as const, label: lang === 'id' ? 'Semua (20)' : 'All (20)' },
                  { id: 'warm' as const, label: lang === 'id' ? 'Hangat' : 'Warm' },
                  { id: 'calm' as const, label: lang === 'id' ? 'Tenang' : 'Calm' },
                  { id: 'heavy' as const, label: lang === 'id' ? 'Berat' : 'Heavy' },
                ].map((cat) => {
                  const isCatActive = categoryFilter === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.catPill,
                        isCatActive && styles.catPillActive,
                        isCatActive && isNight && { backgroundColor: PALETTE.botanicalHeader },
                      ]}
                      onPress={() => {
                        HapticsService.selection();
                        setCategoryFilter(cat.id);
                      }}
                    >
                      <Text
                        style={[
                          styles.catPillText,
                          isCatActive && styles.catPillTextActive,
                          !isCatActive && isNight && { color: PALETTE.nightInkSecondary },
                        ]}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 4-Column Emotion Grid */}
            <View style={styles.grid}>
              {filteredEmotions.map((emo) => {
                const isSelected = selectedMood === emo.id;
                return (
                  <TouchableOpacity
                    key={emo.id}
                    style={[
                      styles.gridCard,
                      isSelected && styles.gridCardSelected,
                      isSelected && isNight && { backgroundColor: '#1F332C' },
                      !isSelected && isNight && styles.nightGridCard,
                    ]}
                    onPress={() => {
                      HapticsService.selection();
                      setSelectedMood(emo.id);
                    }}
                    activeOpacity={0.75}
                  >
                    <Image source={emo.image} style={styles.gridCardImg} resizeMode="contain" />
                    <Text
                      style={[
                        styles.gridCardLabel,
                        isSelected && styles.gridCardLabelSelected,
                        !isSelected && isNight && { color: PALETTE.nightInk },
                      ]}
                      numberOfLines={1}
                    >
                      {emo.label[lang]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 2. NUANCED FEELINGS */}
            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionHeading, isNight && { color: PALETTE.nightInkMuted }]}>
                {lang === 'id' ? '2. NUANSA PERASAAN LAINNYA' : '2. NUANCED FEELINGS'}
              </Text>
              <View style={styles.wrapRow}>
                {NUANCED_FEELINGS.map((item) => {
                  const isChecked = selectedNuances.includes(item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.pillOption,
                        isChecked && styles.pillOptionActive,
                        !isChecked && isNight && styles.nightPillOption,
                      ]}
                      onPress={() => toggleNuance(item.id)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.pillOptionText,
                          isChecked && styles.pillOptionTextActive,
                          !isChecked && isNight && { color: PALETTE.nightInkSecondary },
                        ]}
                      >
                        {item.label[lang]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. WHERE DO YOU FEEL IT IN YOUR BODY? */}
            <View style={styles.sectionBlock}>
              <Text style={[styles.sectionHeading, isNight && { color: PALETTE.nightInkMuted }]}>
                {lang === 'id' ? '3. DI MANA KAMU MERASAKANNYA DI TUBUH?' : '3. WHERE DO YOU FEEL IT IN YOUR BODY?'}
              </Text>
              <View style={styles.wrapRow}>
                {BODY_SENSATIONS.map((item) => {
                  const isChecked = selectedSensations.includes(item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.sensationPill,
                        isChecked && styles.sensationPillActive,
                        !isChecked && isNight && styles.nightPillOption,
                      ]}
                      onPress={() => toggleSensation(item.id)}
                      activeOpacity={0.75}
                    >
                      <Text style={{ fontSize: 13, marginRight: 4 }}>{item.icon}</Text>
                      <Text
                        style={[
                          styles.sensationText,
                          isChecked && styles.sensationTextActive,
                          !isChecked && isNight && { color: PALETTE.nightInkSecondary },
                        ]}
                      >
                        {item.label[lang]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Short Note Input */}
            <View style={styles.sectionBlock}>
              <TextInput
                style={[styles.noteInput, isNight && styles.nightNoteInput]}
                placeholder={
                  lang === 'id'
                    ? 'Catatan singkat (opsional)...'
                    : 'Add a short reflection (optional)...'
                }
                placeholderTextColor={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleConfirm}
              activeOpacity={0.85}
            >
              <Check size={16} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.saveBtnText}>
                {lang === 'id' ? 'Simpan Pemeriksaan Batin' : 'Save Check-In'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 35, 32, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FAF7F0',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
    paddingHorizontal: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  nightSheet: {
    backgroundColor: PALETTE.nightCard,
    borderWidth: 1,
    borderColor: PALETTE.nightBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(38, 63, 54, 0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  heartBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FBE8E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.serifSemiBold,
    color: PALETTE.ink,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: FONTS.sansRegular,
    color: PALETTE.inkSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8E0D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nightCloseBtn: {
    backgroundColor: PALETTE.nightCardSecondary,
  },
  scroll: {
    paddingTop: 14,
    gap: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  sectionHeading: {
    fontSize: 10,
    fontFamily: FONTS.sansBold,
    color: '#6E6259',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  filterPillsRow: {
    flexDirection: 'row',
    backgroundColor: '#E6DEC8',
    borderRadius: 16,
    padding: 3,
    gap: 2,
  },
  nightFilterPillsRow: {
    backgroundColor: PALETTE.nightCardSecondary,
  },
  catPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  catPillActive: {
    backgroundColor: '#263F36',
  },
  catPillText: {
    fontSize: 10,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkSecondary,
  },
  catPillTextActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  nightGridCard: {
    backgroundColor: PALETTE.nightCardSecondary,
    borderColor: PALETTE.nightBorder,
  },
  gridCardSelected: {
    backgroundColor: '#1F332C',
    borderColor: '#1F332C',
    shadowColor: '#1F332C',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  gridCardImg: {
    width: 32,
    height: 32,
    marginBottom: 4,
  },
  gridCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.sansMedium,
    color: '#2A2421',
    textAlign: 'center',
  },
  gridCardLabelSelected: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  sectionBlock: {
    gap: 6,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5DEC9',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  nightPillOption: {
    backgroundColor: PALETTE.nightCardSecondary,
    borderColor: PALETTE.nightBorder,
  },
  pillOptionActive: {
    backgroundColor: '#1F332C',
    borderColor: '#1F332C',
  },
  pillOptionText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: '#544943',
  },
  pillOptionTextActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  sensationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5DEC9',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sensationPillActive: {
    backgroundColor: PALETTE.terracotta,
    borderColor: PALETTE.terracotta,
  },
  sensationText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: '#544943',
  },
  sensationTextActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.sansBold,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 12,
    fontFamily: FONTS.sansRegular,
    color: PALETTE.ink,
    borderWidth: 1,
    borderColor: '#E5DEC9',
  },
  nightNoteInput: {
    backgroundColor: PALETTE.nightCardSecondary,
    borderColor: PALETTE.nightBorder,
    color: PALETTE.nightInk,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1F332C',
    paddingVertical: 13,
    borderRadius: 24,
    shadowColor: '#1F332C',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 4,
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: FONTS.sansSemiBold,
    color: '#FFFFFF',
  },
});
