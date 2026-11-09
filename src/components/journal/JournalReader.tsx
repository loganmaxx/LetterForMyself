import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { ArrowLeft, Star, Edit3, Trash2 } from 'lucide-react-native';
import { JournalEntry, Language } from '../../types';
import { ALL_EMOTIONS } from '../../constants/emotions';
import { PALETTE, PAPER_STYLES, FONTS } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';
import { PaperBackground } from '../common/PaperBackground';

interface JournalReaderProps {
  language: Language;
  nightMode: boolean;
  entry: JournalEntry;
  onClose: () => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const JournalReader: React.FC<JournalReaderProps> = ({
  language,
  nightMode,
  entry,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const isNight = nightMode;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const emotion = ALL_EMOTIONS.find((e) => e.id === entry.mood);
  const paper = PAPER_STYLES[entry.paperTheme] || PAPER_STYLES.parchment;

  const dateStr = new Date(entry.createdAt).toLocaleDateString(
    language === 'id' ? 'id-ID' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <View style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}>
      {/* 1. Header Toolbar */}
      <View style={[styles.topBar, isNight && styles.nightTopBar]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            HapticsService.light();
            onClose();
          }}
        >
          <ArrowLeft size={18} color={isNight ? PALETTE.nightInk : PALETTE.ink} />
          <Text style={[styles.backText, isNight && { color: PALETTE.nightInk }]}>
            {language === 'id' ? 'Kembali' : 'Back'}
          </Text>
        </TouchableOpacity>

        <View style={styles.topRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              HapticsService.light();
              onToggleFavorite(entry.id);
            }}
          >
            <Star
              size={18}
              color={entry.isFavorite ? '#E8A838' : isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
              fill={entry.isFavorite ? '#E8A838' : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              HapticsService.light();
              onEdit(entry);
            }}
          >
            <Edit3 size={14} color={isNight ? PALETTE.nightInk : PALETTE.ink} />
            <Text style={[styles.actionBtnText, isNight && { color: PALETTE.nightInk }]}>
              {language === 'id' ? 'Sunting' : 'Edit'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => {
              HapticsService.light();
              setDeleteModalVisible(true);
            }}
          >
            <Trash2 size={16} color="#E63946" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Editorial Paper Content Sheet */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.paperSheet,
            {
              backgroundColor: isNight ? PALETTE.nightCard : paper.bg,
              borderColor: paper.border,
            },
          ]}
        >
          {/* Authentic Ruled Lines or Dot Grid Background Texture */}
          <PaperBackground theme={entry.paperTheme} isNight={isNight} />

          <View style={styles.metaRow}>
            <Text style={styles.dateText}>{dateStr}</Text>
            {emotion && (
              <View style={styles.moodPill}>
                <Image source={emotion.image} style={styles.moodImg} resizeMode="contain" />
                <Text style={styles.moodLabel}>{emotion.label[language]}</Text>
              </View>
            )}
          </View>

          {/* Title in Newsreader SemiBold */}
          <Text style={[styles.title, { color: isNight ? PALETTE.nightInk : paper.text }]}>
            {entry.title}
          </Text>

          {/* Anxiety Unload Circle of Control */}
          {entry.unloadData && (
            <View style={styles.unloadBox}>
              <Text style={styles.unloadTitle}>🍃 {language === 'id' ? 'Dalam Kendaliku:' : 'Within Control:'}</Text>
              {entry.unloadData.withinControl.map((item, idx) => (
                <Text key={idx} style={styles.unloadItem}>• {item}</Text>
              ))}

              <Text style={[styles.unloadTitle, { marginTop: 10, color: PALETTE.terracotta }]}>
                ☁️ {language === 'id' ? 'Dilepaskan:' : 'Letting go:'}
              </Text>
              {entry.unloadData.outsideControl.map((item, idx) => (
                <Text key={idx} style={[styles.unloadItem, { textDecorationLine: 'line-through', opacity: 0.7 }]}>
                  • {item}
                </Text>
              ))}
            </View>
          )}

          {/* Main Body in Newsreader Regular */}
          <Text
            style={[
              styles.body,
              {
                color: isNight ? PALETTE.nightInk : paper.text,
                lineHeight: entry.paperTheme === 'lined' || entry.paperTheme === 'terracotta' ? 32 : 26,
              },
            ]}
          >
            {entry.content}
          </Text>

          {/* Note to Myself in Caveat Handwriting */}
          {entry.affirmationNote && (
            <View style={styles.affirmationBox}>
              <Text style={styles.affirmationTitle}>
                💌 {language === 'id' ? 'Pesan untuk Diri Sendiri' : 'Note to Myself'}
              </Text>
              <Text style={styles.affirmationContent}>"{entry.affirmationNote}"</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 3. Delete Confirmation Modal Popup */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, isNight && { backgroundColor: PALETTE.nightCard }]}>
            <View style={styles.deleteIconBox}>
              <Trash2 size={24} color={PALETTE.terracotta} />
            </View>
            <Text style={[styles.modalTitle, isNight && { color: PALETTE.nightInk }]}>
              {language === 'id' ? 'Hapus surat ini?' : 'Delete this letter?'}
            </Text>
            <Text style={[styles.modalSub, isNight && { color: PALETTE.nightInkMuted }]}>
              {language === 'id'
                ? 'Catatan kenangan ini akan dihapus permanen dan tidak dapat dikembalikan.'
                : 'This memory will be permanently removed from your notebook.'}
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, isNight && { backgroundColor: PALETTE.nightCardSecondary }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={[styles.modalCancelText, isNight && { color: PALETTE.nightInk }]}>
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDeleteBtn}
                onPress={() => {
                  HapticsService.medium();
                  setDeleteModalVisible(false);
                  onDelete(entry.id);
                  onClose();
                }}
              >
                <Text style={styles.modalDeleteText}>
                  {language === 'id' ? 'Ya, Hapus' : 'Delete'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(38, 63, 54, 0.06)',
    backgroundColor: PALETTE.bg,
  },
  nightTopBar: {
    backgroundColor: PALETTE.nightBg,
    borderBottomColor: PALETTE.nightBorder,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 13,
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.ink,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBtn: {
    padding: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PALETTE.sand,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 12,
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.ink,
  },
  deleteBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  paperSheet: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.botanicalHeader,
    letterSpacing: 0.3,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  moodImg: {
    width: 20,
    height: 20,
  },
  moodLabel: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.ink,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.serifSemiBold,
    marginBottom: 16,
    lineHeight: 28,
  },
  body: {
    fontSize: 15,
    fontFamily: FONTS.serifRegular,
    lineHeight: 26,
  },
  unloadBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  unloadTitle: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.botanicalHeader,
    marginBottom: 4,
  },
  unloadItem: {
    fontSize: 13,
    fontFamily: FONTS.sansRegular,
    color: PALETTE.ink,
    lineHeight: 20,
  },
  affirmationBox: {
    marginTop: 22,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FDF3EE',
    borderWidth: 1,
    borderColor: '#F6D8CE',
  },
  affirmationTitle: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.terracotta,
    marginBottom: 4,
  },
  affirmationContent: {
    fontSize: 19,
    fontFamily: FONTS.handwriting,
    color: PALETTE.terracotta,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  deleteIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDF3EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: FONTS.serifSemiBold,
    color: PALETTE.ink,
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 12,
    fontFamily: FONTS.sansRegular,
    color: PALETTE.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F0ECE4',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 12,
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.ink,
  },
  modalDeleteBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: PALETTE.terracotta,
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 12,
    fontFamily: FONTS.sansBold,
    color: '#FFFFFF',
  },
});
