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
import { ArrowLeft, Check, Star, Lock, Palette } from 'lucide-react-native';
import { JournalEntry, Language, MoodType, PaperTheme, TemplateType } from '../../types';
import { ALL_EMOTIONS } from '../../constants/emotions';
import { PALETTE, PAPER_STYLES, FONTS } from '../../constants/theme';
import { HapticsService } from '../../services/hapticsService';
import { PaperBackground } from '../common/PaperBackground';

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
  const [affirmationNote, setAffirmationNote] = useState(editingEntry?.affirmationNote || '');
  const [template, setTemplate] = useState<TemplateType>(editingEntry?.template || initialTemplate);
  const [mood, setMood] = useState<MoodType>(editingEntry?.mood || 'peaceful');
  const [paperTheme, setPaperTheme] = useState<PaperTheme>(
    editingEntry?.paperTheme || (isNight ? 'midnight' : 'lined')
  );
  const [showPaperDrawer, setShowPaperDrawer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(editingEntry?.isFavorite || false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Auto-save draft feedback
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
      affirmationNote: affirmationNote.trim() || undefined,
      isFavorite,
    });
  };

  const currentPaper = PAPER_STYLES[paperTheme] || PAPER_STYLES.parchment;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, isNight && { backgroundColor: PALETTE.nightBg }]}
    >
      {/* 1. Header Toolbar (Save button permanently pinned & solid) */}
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
                {language === 'id' ? 'Tersimpan' : 'Saved'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.topRight}>
          {/* Toggle Paper Themes */}
          <TouchableOpacity
            style={[
              styles.paperThemeBtn,
              showPaperDrawer && styles.paperThemeBtnActive,
              isNight && { backgroundColor: showPaperDrawer ? PALETTE.botanicalHeader : PALETTE.nightCardSecondary },
            ]}
            onPress={() => {
              HapticsService.light();
              setShowPaperDrawer(!showPaperDrawer);
            }}
          >
            <Palette
              size={14}
              color={showPaperDrawer ? '#FFFFFF' : isNight ? PALETTE.nightInk : PALETTE.ink}
            />
            <Text
              style={[
                styles.paperThemeBtnText,
                showPaperDrawer && { color: '#FFFFFF' },
                isNight && !showPaperDrawer && { color: PALETTE.nightInk },
              ]}
            >
              {language === 'id' ? 'Kertas' : 'Paper'}
            </Text>
          </TouchableOpacity>

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

          {/* Primary Save Button */}
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
        {/* 2. Unified Segmented Mode Switcher */}
        <View style={styles.templateSwitcherWrapper}>
          <View style={[styles.templateSwitcher, isNight && styles.nightTemplateSwitcher]}>
            {[
              { id: 'freeflow' as TemplateType, icon: '🪶', label: language === 'id' ? 'Jurnal' : 'Journal' },
              { id: 'capsule' as TemplateType, icon: '💌', label: language === 'id' ? 'Kapsul' : 'Capsule' },
              { id: 'cbt' as TemplateType, icon: '🌱', label: 'CBT' },
              { id: 'unload' as TemplateType, icon: '🍃', label: language === 'id' ? 'Lepas Beban' : 'Unload' },
            ].map((t) => {
              const isSelected = template === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.templateTab,
                    isSelected && styles.templateTabActive,
                    isSelected && isNight && { backgroundColor: PALETTE.nightCardSecondary },
                  ]}
                  onPress={() => {
                    HapticsService.selection();
                    setTemplate(t.id);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.templateTabIcon}>{t.icon}</Text>
                  <Text
                    style={[
                      styles.templateTabText,
                      isSelected && styles.templateTabTextActive,
                      isNight && !isSelected && { color: PALETTE.nightInkSecondary },
                    ]}
                  >
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
                  style={[
                    styles.moodChip,
                    isSelected && styles.moodChipActive,
                    isNight && { backgroundColor: isSelected ? 'rgba(75, 123, 107, 0.4)' : PALETTE.nightCardSecondary },
                  ]}
                  onPress={() => {
                    HapticsService.selection();
                    setMood(emo.id);
                  }}
                >
                  <Image source={emo.image} style={styles.moodChipImg} resizeMode="contain" />
                  <Text
                    style={[
                      styles.moodChipLabel,
                      isSelected && styles.moodChipLabelActive,
                      isNight && !isSelected && { color: PALETTE.nightInkSecondary },
                    ]}
                  >
                    {emo.label[language]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Paper Theme Drawer */}
        {showPaperDrawer && (
          <View style={[styles.paperDrawer, isNight && styles.nightPaperDrawer]}>
            <Text style={[styles.drawerSubtitle, isNight && { color: PALETTE.nightInkMuted }]}>
              {language === 'id' ? 'PILIH TEMA KERTAS' : 'CHOOSE PAPER THEME'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.drawerRow}>
              {[
                { id: 'lined' as PaperTheme, icon: '📝', label: language === 'id' ? 'Bergaris' : 'Lined' },
                { id: 'parchment' as PaperTheme, icon: '📜', label: language === 'id' ? 'Perkamen' : 'Parchment' },
                { id: 'dotgrid' as PaperTheme, icon: '⠇', label: 'Dot Grid' },
                { id: 'botanical' as PaperTheme, icon: '🌿', label: 'Botanical' },
                { id: 'terracotta' as PaperTheme, icon: '🏺', label: 'Terracotta' },
                { id: 'midnight' as PaperTheme, icon: '🌙', label: 'Midnight' },
              ].map((p) => {
                const isSelected = paperTheme === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.paperThemePill,
                      isSelected && styles.paperThemePillActive,
                      isNight && { backgroundColor: isSelected ? PALETTE.botanicalHeader : PALETTE.nightCardSecondary },
                    ]}
                    onPress={() => {
                      HapticsService.selection();
                      setPaperTheme(p.id);
                    }}
                  >
                    <Text style={styles.paperThemePillIcon}>{p.icon}</Text>
                    <Text
                      style={[
                        styles.paperThemePillText,
                        isSelected && styles.paperThemePillTextActive,
                        isNight && !isSelected && { color: PALETTE.nightInkSecondary },
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 4. Tactile Editorial Paper Sheet */}
        <View
          style={[
            styles.paperCanvas,
            {
              backgroundColor: isNight ? PALETTE.nightCard : currentPaper.bg,
              borderColor: currentPaper.border,
            },
          ]}
        >
          {/* Authentic Ruled Lines or Dot Grid Background Texture */}
          <PaperBackground theme={paperTheme} isNight={isNight} />

          {initialPrompt ? (
            <View style={styles.promptBanner}>
              <Text style={styles.promptBannerText}>{initialPrompt}</Text>
            </View>
          ) : null}

          {/* Title Input in Editorial Serif */}
          <TextInput
            style={[styles.titleInput, { color: isNight ? PALETTE.nightInk : currentPaper.text }]}
            placeholder={language === 'id' ? 'Judul catatan hatimu...' : 'Title of your reflection...'}
            placeholderTextColor={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={120}
          />

          <View style={styles.divider} />

          {/* Content Multi-line Input in Editorial Serif with Ruled Line Spacing */}
          <TextInput
            style={[
              styles.contentInput,
              {
                color: isNight ? PALETTE.nightInk : currentPaper.text,
                lineHeight: paperTheme === 'lined' || paperTheme === 'terracotta' ? 32 : 24,
              },
            ]}
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

          {/* Affirmation Note to Self in Caveat Handwriting */}
          <View style={styles.affirmationInputBox}>
            <Text style={styles.affirmationInputLabel}>
              💌 {language === 'id' ? 'Pesan untuk Diri Sendiri (Tulisan Tangan):' : 'Note to Myself:'}
            </Text>
            <TextInput
              style={[styles.affirmationInput, { color: isNight ? '#F5D089' : PALETTE.terracotta }]}
              placeholder={language === 'id' ? 'Tuliskan kata hangat untukmu...' : 'A kind whisper to self...'}
              placeholderTextColor={isNight ? PALETTE.nightInkMuted : PALETTE.inkMuted}
              value={affirmationNote}
              onChangeText={setAffirmationNote}
            />
          </View>
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(38, 63, 54, 0.06)',
    backgroundColor: PALETTE.bg,
  },
  nightTopBar: {
    backgroundColor: PALETTE.nightBg,
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
    paddingHorizontal: 6,
  },
  backText: {
    fontSize: 13,
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.ink,
  },
  draftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCE8E2',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  draftText: {
    fontSize: 10,
    fontFamily: FONTS.sansBold,
    color: '#263F36',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
  },
  paperThemeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: PALETTE.sand,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  paperThemeBtnActive: {
    backgroundColor: PALETTE.botanicalHeader,
  },
  paperThemeBtnText: {
    fontSize: 11,
    fontFamily: FONTS.sansSemiBold,
    color: PALETTE.ink,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.botanicalHeader,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#263F36',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: FONTS.sansBold,
  },
  scrollContent: {
    padding: 16,
  },
  templateSwitcherWrapper: {
    alignItems: 'center',
    marginBottom: 14,
  },
  templateSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(232, 224, 210, 0.7)',
    borderRadius: 24,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  nightTemplateSwitcher: {
    backgroundColor: PALETTE.nightCard,
    borderColor: PALETTE.nightBorder,
  },
  templateTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  templateTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  templateTabIcon: {
    fontSize: 12,
  },
  templateTabText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkSecondary,
  },
  templateTabTextActive: {
    fontFamily: FONTS.sansBold,
    color: PALETTE.ink,
  },
  moodPickerSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  sectionSubtitle: {
    fontSize: 9,
    fontFamily: FONTS.sansBold,
    color: PALETTE.inkMuted,
    letterSpacing: 0.8,
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
    borderRadius: 14,
  },
  moodChipActive: {
    backgroundColor: '#DCE8E2',
    borderWidth: 1.5,
    borderColor: PALETTE.botanicalHeader,
  },
  moodChipImg: {
    width: 28,
    height: 28,
    marginBottom: 2,
  },
  moodChipLabel: {
    fontSize: 9,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkSecondary,
  },
  moodChipLabelActive: {
    fontFamily: FONTS.sansBold,
    color: PALETTE.botanicalHeader,
  },
  paperDrawer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  nightPaperDrawer: {
    backgroundColor: PALETTE.nightCard,
    borderColor: PALETTE.nightBorder,
  },
  drawerSubtitle: {
    fontSize: 9,
    fontFamily: FONTS.sansBold,
    color: PALETTE.inkMuted,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  drawerRow: {
    gap: 8,
  },
  paperThemePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F7F4EE',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  paperThemePillActive: {
    backgroundColor: '#DCE8E2',
    borderWidth: 1.5,
    borderColor: PALETTE.botanicalHeader,
  },
  paperThemePillIcon: {
    fontSize: 12,
  },
  paperThemePillText: {
    fontSize: 11,
    fontFamily: FONTS.sansMedium,
    color: PALETTE.inkSecondary,
  },
  paperThemePillTextActive: {
    fontFamily: FONTS.sansBold,
    color: PALETTE.botanicalHeader,
  },
  paperCanvas: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    minHeight: 280,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  promptBanner: {
    backgroundColor: '#FDF3EE',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  promptBannerText: {
    fontSize: 13,
    fontFamily: FONTS.serifItalic,
    color: PALETTE.terracotta,
  },
  titleInput: {
    fontSize: 20,
    fontFamily: FONTS.serifSemiBold,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 10,
  },
  contentInput: {
    fontSize: 15,
    fontFamily: FONTS.serifRegular,
    lineHeight: 24,
    minHeight: 180,
  },
  affirmationInputBox: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  affirmationInputLabel: {
    fontSize: 11,
    fontFamily: FONTS.sansBold,
    color: PALETTE.terracotta,
    marginBottom: 4,
  },
  affirmationInput: {
    fontSize: 18,
    fontFamily: FONTS.handwriting,
    paddingVertical: 2,
  },
  bottomSaveBtn: {
    backgroundColor: PALETTE.botanicalHeader,
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#263F36',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  bottomSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: FONTS.sansBold,
  },
});
