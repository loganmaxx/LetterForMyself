import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { ArrowLeft, Check, Star, Lock } from 'lucide-react-native';
import { JournalEntry, Language, MoodType, PaperTheme, TemplateType } from '../../types';
import { ALL_EMOTIONS } from '../../constants/emotions';
import { PALETTE, PAPER_STYLES } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';

interface JournalStudioProps {
  language: Language;
  nightMode: boolean;
  initialTemplate?: TemplateType;
  initialPrompt?: string;
  editingEntry?: JournalEntry | null;
  onSave: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const JournalStudio: React.FC<JournalStudioProps> = ({
  language,
  nightMode,
  initialTemplate = 'freeflow',
  initialPrompt,
  editingEntry,
  onSave,
  onCancel,
}) => {
  const isNight = nightMode;
  const [title, setTitle] = useState(editingEntry?.title || '');
  const [content, setContent] = useState(editingEntry?.content || '');
  const [template, setTemplate] = useState<TemplateType>(editingEntry?.template || initialTemplate);
  const [mood, setMood] = useState<MoodType>(editingEntry?.mood || 'peaceful');
  const [paperTheme, setPaperTheme] = useState<PaperTheme>(editingEntry?.paperTheme || (isNight ? 'midnight' : 'parchment'));
  const [isFavorite, setIsFavorite] = useState(editingEntry?.isFavorite || false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Auto-save draft visual feedback
  useEffect(() => {
    if (content.length > 5) {
      setDraftSaved(true);
      const timer = setTimeout(() => setDraftSaved(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [content]);

  const handleSave = () => {
    HapticsService.success();
    const finalTitle =
      title.trim() ||
      (language === 'id' ? 'Catatan Hati' : 'Reflection of the day');
    const finalContent =
      content.trim() ||
      (language === 'id' ? 'Catatan tenang hari ini.' : 'Quiet thought.');

    onSave({
      title: finalTitle,
      content: finalContent,
      template,
      paperTheme,
      fontStyle: 'serif',
      mood,
      emotions: [mood],
      energyLevel: 4,
      tags: [],
      promptUsed: initialPrompt,
      isFavorite,
    });
  };

  const currentPaper = PAPER_STYLES[paperTheme] || PAPER_STYLES.parchment;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}
    >
      {/* 1. Header Toolbar */}
      <View style={[styles.topBar, isNight && styles.nightTopBar]}>
        <View style={styles.topLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              HapticsService.light();
              onCancel();
            }}
          >
            <ArrowLeft size={18} color={isNight ? PALETTE.nightInk : PALETTE.ink} />
            <Text style={[styles.backText, isNight && { color: PALETTE.nightInk }]}>
              {language === 'id' ? 'Kembali' : 'Back'}
            </Text>
          </TouchableOpacity>

          {draftSaved && (
            <View style={styles.draftBadge}>
              <Check size={11} color="#263F36" />
              <Text style={styles.draftText}>
                {language === 'id' ? 'Draft tersimpan' : 'Draft saved'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.topRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              HapticsService.light();
              setIsFavorite(!isFavorite);
            }}
          >
            <Star
              size={18}
              color={isFavorite ? '#E8A838' : isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
              fill={isFavorite ? '#E8A838' : 'transparent'}
            />
          </TouchableOpacity>

          {/* Primary Save Button - Permanently Visible and Solid */}
          <TouchableOpacity
            style={[
              styles.saveBtn,
              template === 'capsule' && { backgroundColor: PALETTE.terracotta },
            ]}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            {template === 'capsule' && <Lock size={12} color="#FFFFFF" style={{ marginRight: 4 }} />}
            <Text style={styles.saveBtnText}>
              {template === 'capsule'
                ? language === 'id' ? 'Segel' : 'Seal'
                : language === 'id' ? 'Simpan' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Template Selector Tabs */}
        <View style={styles.templateScroll}>
          {[
            { id: 'freeflow' as TemplateType, label: language === 'id' ? '🪶 Jurnal Bebas' : '🪶 Free Journal' },
            { id: 'capsule' as TemplateType, label: language === 'id' ? '💌 Kapsul Waktu' : '💌 Time Capsule' },
            { id: 'unload' as TemplateType, label: language === 'id' ? '🍃 Lepaskan Beban' : '🍃 Unload' },
          ].map((t) => {
            const isSelected = template === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.templatePill,
                  isSelected && styles.templatePillActive,
                  isNight && { backgroundColor: isSelected ? PALETTE.primary : PALETTE.nightCard },
                ]}
                onPress={() => {
                  HapticsService.selection();
                  setTemplate(t.id);
                }}
              >
                <Text
                  style={[
                    styles.templateText,
                    isSelected && styles.templateTextActive,
                    isNight && !isSelected && { color: PALETTE.nightInkSecondary },
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3. 3D Mood Character Picker Bar */}
        <View style={[styles.moodPickerSection, isNight && { backgroundColor: PALETTE.nightCard }]}>
          <Text style={[styles.sectionSubtitle, isNight && { color: PALETTE.nightInkMuted }]}>
            {language === 'id' ? 'PILIH EMOSI SURAT INI' : 'CHOOSE ENTRY EMOTION'}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodRow}>
            {ALL_EMOTIONS.slice(0, 10).map((emo) => {
              const isSelected = mood === emo.id;
              return (
                <TouchableOpacity
                  key={emo.id}
                  style={[styles.moodChip, isSelected && styles.moodChipActive]}
                  onPress={() => {
                    HapticsService.selection();
                    setMood(emo.id);
                  }}
                >
                  <Image source={emo.image} style={styles.moodChipImg} resizeMode="contain" />
                  <Text style={[styles.moodChipLabel, isSelected && styles.moodChipLabelActive]}>
                    {emo.label[language]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. Tactile Paper Canvas */}
        <View style={[styles.paperCanvas, { backgroundColor: isNight ? PALETTE.nightCard : currentPaper.bg, borderColor: currentPaper.border }]}>
          {initialPrompt ? (
            <View style={styles.promptBanner}>
              <Text style={styles.promptBannerText}>{initialPrompt}</Text>
            </View>
          ) : null}

          {/* Title Input */}
          <TextInput
            style={[styles.titleInput, { color: isNight ? PALETTE.nightInk : currentPaper.text }]}
            placeholder={language === 'id' ? 'Judul catatan hatimu...' : 'Title of your reflection...'}
            placeholderTextColor={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={120}
          />

          <View style={styles.divider} />

          {/* Content Multi-line Input */}
          <TextInput
            style={[styles.contentInput, { color: isNight ? PALETTE.nightInk : currentPaper.text }]}
            placeholder={
              language === 'id'
                ? 'Tuliskan apa pun yang sedang kamu rasakan tanpa perlu dihakimi...'
                : 'Write gently whatever is on your heart...'
            }
            placeholderTextColor={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* 5. Mobile Quick Bottom Save */}
        <TouchableOpacity style={styles.bottomSaveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.bottomSaveBtnText}>
            {template === 'capsule'
              ? language === 'id' ? 'Segel Kapsul Waktu' : 'Seal Time-Capsule'
              : language === 'id' ? 'Simpan Surat ke Jurnal' : 'Save Letter'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
    color: PALETTE.ink,
  },
  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DDE9E2',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  draftText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#263F36',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 8,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  templateScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  templatePill: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    backgroundColor: '#E8E0D2',
    borderRadius: 16,
  },
  templatePillActive: {
    backgroundColor: PALETTE.primary,
  },
  templateText: {
    fontSize: 11,
    fontWeight: '600',
    color: PALETTE.ink,
  },
  templateTextActive: {
    color: '#FFFFFF',
  },
  moodPickerSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  sectionSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: PALETTE.inkMuted,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  moodRow: {
    gap: 8,
  },
  moodChip: {
    alignItems: 'center',
    backgroundColor: '#F7F4EE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  moodChipActive: {
    backgroundColor: '#DDE9E2',
    borderWidth: 1.5,
    borderColor: PALETTE.primary,
  },
  moodChipImg: {
    width: 28,
    height: 28,
    marginBottom: 2,
  },
  moodChipLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: PALETTE.inkSecondary,
  },
  moodChipLabelActive: {
    fontWeight: '700',
    color: PALETTE.primary,
  },
  paperCanvas: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    minHeight: 280,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  promptBanner: {
    backgroundColor: '#FDF3EE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  promptBannerText: {
    fontSize: 12,
    color: '#B85330',
    fontStyle: 'italic',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 10,
  },
  contentInput: {
    fontSize: 14,
    lineHeight: 22,
    minHeight: 180,
  },
  bottomSaveBtn: {
    backgroundColor: PALETTE.primary,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
