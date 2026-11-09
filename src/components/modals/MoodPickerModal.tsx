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
import { PALETTE } from '../../constants/theme';
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
    fontSize: 16,
    fontWeight: '700',
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
    borderRadius: 14,
    marginBottom: 4,
  },
  gridItemActive: {
    backgroundColor: '#DDE9E2',
    borderWidth: 1.5,
    borderColor: PALETTE.primary,
  },
  gridImg: {
    width: 38,
    height: 38,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: PALETTE.inkSecondary,
    textAlign: 'center',
  },
  gridLabelActive: {
    color: PALETTE.primary,
    fontWeight: '700',
  },
  noteSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.inkMuted,
    marginBottom: 6,
  },
  noteInput: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EFE7DA',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
  },
  confirmBtn: {
    backgroundColor: PALETTE.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
