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
import { X } from 'lucide-react-native';
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

export const MoodPickerModal: React.FC<MoodPickerModalProps> = ({
  visible,
  language,
  nightMode,
  onClose,
  onSelectMood,
}) => {
  const isNight = nightMode;
  const [selectedMood, setSelectedMood] = useState<MoodType>('peaceful');
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    HapticsService.success();
    onSelectMood(selectedMood, note);
    setNote('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, isNight && { backgroundColor: PALETTE.nightCard }]}>
          <View style={styles.header}>
            <Text style={[styles.title, isNight && { color: PALETTE.nightInk }]}>
              {language === 'id' ? 'Pilih Emosi Hatimu' : 'Check In With Your Heart'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
            {/* 20 Emotion Grid */}
            <View style={styles.grid}>
              {ALL_EMOTIONS.map((emo) => {
                const isSelected = selectedMood === emo.id;
                return (
                  <TouchableOpacity
                    key={emo.id}
                    style={[
                      styles.gridItem,
                      isSelected && styles.gridItemActive,
                      isNight && { backgroundColor: isSelected ? 'rgba(75, 123, 107, 0.4)' : PALETTE.nightCardSecondary },
                    ]}
                    onPress={() => {
                      HapticsService.selection();
                      setSelectedMood(emo.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Image source={emo.image} style={styles.gridImg} resizeMode="contain" />
                    <Text
                      style={[
                        styles.gridLabel,
                        isSelected && styles.gridLabelActive,
                        isNight && !isSelected && { color: PALETTE.nightInkSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {emo.label[language]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Optional Short Note */}
            <View style={styles.noteSection}>
              <Text style={[styles.noteLabel, isNight && { color: PALETTE.nightInkMuted }]}>
                {language === 'id' ? 'Catatan singkat (opsional):' : 'Short note (optional):'}
              </Text>
              <TextInput
                style={[
                  styles.noteInput,
                  isNight && {
                    backgroundColor: PALETTE.nightCardSecondary,
                    color: PALETTE.nightInk,
                    borderColor: PALETTE.nightBorder,
                  },
                ]}
                placeholder={
                  language === 'id'
                    ? 'Apa yang membuatmu merasa seperti ini hari ini?'
                    : 'What prompted this feeling today?'
                }
                placeholderTextColor={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
                value={note}
                onChangeText={setNote}
              />
            </View>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
              <Text style={styles.confirmText}>
                {language === 'id' ? 'Simpan Catatan Emosi' : 'Log Mood Check-In'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '82%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontFamily: FONTS.serifSemiBold,
    color: PALETTE.ink,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '23%',
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 16,
    marginBottom: 4,
  },
  gridItemActive: {
    backgroundColor: '#DCE8E2',
    borderWidth: 1.5,
    borderColor: PALETTE.botanicalHeader,
  },
  gridImg: {
    width: 38,
    height: 38,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 9,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkSecondary,
    textAlign: 'center',
  },
  gridLabelActive: {
    color: PALETTE.botanicalHeader,
    fontFamily: FONTS.sansBold,
  },
  noteSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  noteLabel: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.inkMuted,
    marginBottom: 6,
  },
  noteInput: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EFE7DA',
    borderRadius: 16,
    padding: 12,
    fontSize: 13,
    fontFamily: FONTS.sansRegular,
  },
  confirmBtn: {
    backgroundColor: PALETTE.botanicalHeader,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#263F36',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: FONTS.sansBold,
  },
});
