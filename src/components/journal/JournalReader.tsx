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
import { PALETTE, PAPER_STYLES } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';

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
            <Edit3 size={15} color={isNight ? PALETTE.nightInk : PALETTE.ink} />
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

      {/* 2. Paper Content Sheet */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.paperSheet, { backgroundColor: isNight ? PALETTE.nightCard : paper.bg, borderColor: paper.border }]}>
          <View style={styles.metaRow}>
            <Text style={styles.dateText}>{dateStr}</Text>
            {emotion && (
              <View style={styles.moodPill}>
                <Image source={emotion.image} style={styles.moodImg} resizeMode="contain" />
                <Text style={styles.moodLabel}>{emotion.label[language]}</Text>
              </View>
            )}
          </View>

          <Text style={[styles.title, { color: isNight ? PALETTE.nightInk : paper.text }]}>
            {entry.title}
          </Text>

          {entry.unloadData && (
            <View style={styles.unloadBox}>
              <Text style={styles.unloadTitle}>🍃 {language === 'id' ? 'Dalam Kendaliku:' : 'Within Control:'}</Text>
              {entry.unloadData.withinControl.map((item, idx) => (
                <Text key={idx} style={styles.unloadItem}>• {item}</Text>
              ))}

              <Text style={[styles.unloadTitle, { marginTop: 10, color: '#B85330' }]}>
                ☁️ {language === 'id' ? 'Dilepaskan:' : 'Letting go:'}
              </Text>
              {entry.unloadData.outsideControl.map((item, idx) => (
                <Text key={idx} style={[styles.unloadItem, { textDecorationLine: 'line-through', opacity: 0.7 }]}>• {item}</Text>
              ))}
            </View>
          )}

          <Text style={[styles.body, { color: isNight ? PALETTE.nightInk : paper.text }]}>
            {entry.content}
          </Text>

          {entry.affirmationNote && (
            <View style={styles.affirmationBox}>
              <Text style={styles.affirmationTitle}>💌 {language === 'id' ? 'Pesan untuk Diri Sendiri' : 'Note to Myself'}</Text>
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
              <Trash2 size={24} color="#B85330" />
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: '#FFFFFF',
  },
  nightTopBar: {
    backgroundColor: PALETTE.nightCard,
    borderBottomColor: PALETTE.nightBorder,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
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
    backgroundColor: '#E8E0D2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
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
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.primary,
  },
  moodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.04)',
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
    fontWeight: '600',
    color: PALETTE.ink,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
    lineHeight: 26,
  },
  body: {
    fontSize: 14,
    lineHeight: 24,
  },
  unloadBox: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  unloadTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: PALETTE.primary,
    marginBottom: 4,
  },
  unloadItem: {
    fontSize: 12,
    color: PALETTE.ink,
    lineHeight: 18,
  },
  affirmationBox: {
    marginTop: 20,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FDF3EE',
  },
  affirmationTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B85330',
    marginBottom: 4,
  },
  affirmationContent: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#B85330',
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
    padding: 20,
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
    fontSize: 16,
    fontWeight: '700',
    color: PALETTE.ink,
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 12,
    color: PALETTE.inkMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#F0ECE4',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 12,
    fontWeight: '600',
    color: PALETTE.ink,
  },
  modalDeleteBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#B85330',
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
