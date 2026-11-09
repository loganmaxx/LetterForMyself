import React, { useState, useEffect, useRef } from 'react';
import type {
  CBTData,
  FontStyle,
  JournalEntry,
  Language,
  MoodType,
  PaperTheme,
  TemplateType,
  UnloadData,
} from '../../types';
import {
  BOTANICAL_STICKERS,
  COGNITIVE_DISTORTIONS,
  GUIDED_PROMPTS,
  JOURNAL_TEMPLATES,
  MOOD_META,
  PAPER_THEMES,
  UI_TEXT,
} from '../../data/bilingualData';
import { AudioEngine } from '../../services/audioService';
import {
  ArrowLeft,
  Sparkles,
  Mic,
  MicOff,
  Star,
  Plus,
  Trash2,
  Palette,
  Lock,
  X,
  ChevronDown,
  Check,
  ImagePlus,
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'lfm_autosave_draft_v1';

interface JournalStudioPageProps {
  language: Language;
  defaultPaper: PaperTheme;
  defaultFont: FontStyle;
  initialTemplate?: TemplateType;
  initialPrompt?: string;
  editingEntry?: JournalEntry | null;
  onCancel: () => void;
  onSave: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const JournalStudioModal: React.FC<JournalStudioPageProps> = ({
  language,
  defaultPaper,
  defaultFont,
  initialTemplate = 'freeflow',
  initialPrompt,
  editingEntry,
  onCancel,
  onSave,
}) => {
  const t = UI_TEXT[language];

  // Core Page State
  const [template, setTemplate] = useState<TemplateType>(
    editingEntry?.template || initialTemplate
  );
  const [paperTheme, setPaperTheme] = useState<PaperTheme>(
    editingEntry?.paperTheme || defaultPaper
  );
  const [fontStyle, setFontStyle] = useState<FontStyle>(
    editingEntry?.fontStyle || defaultFont
  );
  const [title, setTitle] = useState(editingEntry?.title || '');
  const [content, setContent] = useState(editingEntry?.content || '');
  const [mood, setMood] = useState<MoodType>(editingEntry?.mood || 'peaceful');
  const [emotions] = useState<string[]>(editingEntry?.emotions || []);
  const [bodySensations] = useState<string[]>(editingEntry?.bodySensations || []);
  const [energyLevel] = useState<number>(editingEntry?.energyLevel || 4);
  const [stickers, setStickers] = useState<string[]>(
    editingEntry?.stickers || ['fern']
  );
  const [tagsInput, setTagsInput] = useState(
    editingEntry?.tags?.join(', ') || ''
  );
  const [promptUsed, setPromptUsed] = useState<string | undefined>(
    editingEntry?.promptUsed || initialPrompt
  );
  const [affirmationNote, setAffirmationNote] = useState(
    editingEntry?.affirmationNote || ''
  );
  const [gratitudeList, setGratitudeList] = useState<string[]>(
    editingEntry?.gratitudeList?.length ? editingEntry.gratitudeList : ['', '', '']
  );
  const [isFavorite, setIsFavorite] = useState(editingEntry?.isFavorite || false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(editingEntry?.photoUrl);
  const [photoCaption, setPhotoCaption] = useState<string>(editingEntry?.photoCaption || '');
  const [unlockDate, setUnlockDate] = useState(() => {
    if (editingEntry?.unlockDate) return editingEntry.unlockDate;
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  // CBT State
  const [cbtData, setCbtData] = useState<CBTData>(
    editingEntry?.cbtData || {
      situation: '',
      automaticThought: '',
      initialBelief: 75,
      distortions: [],
      evidenceFor: '',
      evidenceAgainst: '',
      balancedReframe: '',
      afterBelief: 30,
    }
  );

  // Anxiety Unload State
  const [unloadData, setUnloadData] = useState<UnloadData>(
    editingEntry?.unloadData || {
      withinControl: [],
      outsideControl: [],
      gentleNextStep: '',
    }
  );
  const [newWithinItem, setNewWithinItem] = useState('');
  const [newOutsideItem, setNewOutsideItem] = useState('');

  // Quiet Progressive Disclosure Drawers (Closed by default for calm UI)
  const [showCustomizeDrawer, setShowCustomizeDrawer] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showStickerPopover, setShowStickerPopover] = useState(false);
  const [showExtras, setShowExtras] = useState<boolean>(
    Boolean(
      editingEntry?.affirmationNote ||
        (editingEntry?.gratitudeList && editingEntry.gratitudeList.length > 0)
    )
  );

  // Auto-Save Draft Status
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [restoredFromDraft, setRestoredFromDraft] = useState(false);

  // Voice-to-Text Dictation State
  const [isListening, setIsListening] = useState(false);
  const [voiceUsed, setVoiceUsed] = useState(editingEntry?.voiceUsed || false);
  const [voiceStatusMsg, setVoiceStatusMsg] = useState<string | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  // Load saved draft on mount if creating a new entry
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!editingEntry) {
      try {
        const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const hasText =
            Boolean(parsed.title?.trim()) ||
            Boolean(parsed.content?.trim()) ||
            Boolean(parsed.cbtData?.situation?.trim()) ||
            Boolean(parsed.unloadData?.gentleNextStep?.trim());
          if (hasText) {
            if (parsed.title) setTitle(parsed.title);
            if (parsed.content) setContent(parsed.content);
            if (parsed.template) setTemplate(parsed.template);
            if (parsed.paperTheme) setPaperTheme(parsed.paperTheme);
            if (parsed.fontStyle) setFontStyle(parsed.fontStyle);
            if (parsed.mood) setMood(parsed.mood);
            if (Array.isArray(parsed.stickers)) setStickers(parsed.stickers);
            if (parsed.unlockDate) setUnlockDate(parsed.unlockDate);
            if (parsed.cbtData) setCbtData(parsed.cbtData);
            if (parsed.unloadData) setUnloadData(parsed.unloadData);
            if (parsed.photoUrl) setPhotoUrl(parsed.photoUrl);
            if (parsed.photoCaption) setPhotoCaption(parsed.photoCaption);
            setRestoredFromDraft(true);
            setDraftStatus('saved');
          }
        }
      } catch {}
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [editingEntry]);

  // Debounced Auto-Save to localStorage while writing a new entry
  useEffect(() => {
    if (editingEntry) return;
    const hasMeaningfulContent =
      Boolean(title.trim()) ||
      Boolean(content.trim()) ||
      Boolean(photoUrl) ||
      Boolean(cbtData.situation.trim()) ||
      Boolean(cbtData.automaticThought.trim()) ||
      Boolean(unloadData.gentleNextStep.trim()) ||
      unloadData.withinControl.length > 0 ||
      unloadData.outsideControl.length > 0;

    if (!hasMeaningfulContent) {
      setDraftStatus('idle');
      return;
    }

    setDraftStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            title,
            content,
            template,
            paperTheme,
            fontStyle,
            mood,
            stickers,
            unlockDate,
            cbtData,
            unloadData,
            photoUrl,
            photoCaption,
            savedAt: new Date().toISOString(),
          })
        );
        setDraftStatus('saved');
      } catch {}
    }, 500);

    return () => clearTimeout(timer);
  }, [
    editingEntry,
    title,
    content,
    template,
    paperTheme,
    fontStyle,
    mood,
    stickers,
    unlockDate,
    cbtData,
    unloadData,
    photoUrl,
    photoCaption,
  ]);

  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
    setTitle('');
    setContent('');
    setPhotoUrl(undefined);
    setPhotoCaption('');
    setRestoredFromDraft(false);
    setDraftStatus('idle');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.78);
          setPhotoUrl(compressed);
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const currentPaperMeta =
    PAPER_THEMES.find((p) => p.id === paperTheme) || PAPER_THEMES[0];
  const currentTemplateMeta =
    JOURNAL_TEMPLATES.find((tpl) => tpl.id === template) || JOURNAL_TEMPLATES[0];
  const isDarkPaper = !!currentPaperMeta.isDark;

  const fontClass =
    fontStyle === 'serif'
      ? 'font-serif text-lg leading-relaxed'
      : fontStyle === 'handwriting'
      ? 'font-handwriting text-2xl leading-relaxed tracking-wide'
      : 'font-sans text-base leading-relaxed';

  const handleToggleSticker = (stickerId: string) => {
    setStickers((prev) =>
      prev.includes(stickerId)
        ? prev.filter((s) => s !== stickerId)
        : prev.length < 4
        ? [...prev, stickerId]
        : prev
    );
  };

  const handleToggleDistortion = (distId: string) => {
    setCbtData((prev) => ({
      ...prev,
      distortions: prev.distortions.includes(distId)
        ? prev.distortions.filter((d) => d !== distId)
        : [...prev.distortions, distId],
    }));
  };

  const handleShufflePrompt = () => {
    const random =
      GUIDED_PROMPTS[Math.floor(Math.random() * GUIDED_PROMPTS.length)];
    setPromptUsed(random[language]);
  };

  const handleToggleVoiceDictation = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      setVoiceStatusMsg(null);
      return;
    }

    const SpeechRecognitionAPI =
      (
        window as unknown as {
          SpeechRecognition?: new () => any;
          webkitSpeechRecognition?: new () => any;
        }
      ).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => any })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      const sampleSpoken =
        language === 'en'
          ? '\nTaking a slow breath right now. I am doing the best I can today.'
          : '\nMenarik napas pelan saat ini. Aku sudah berusaha sebaik mungkin hari ini.';
      setContent((prev) =>
        prev ? `${prev}\n${sampleSpoken}` : sampleSpoken.trim()
      );
      setVoiceUsed(true);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = language === 'id' ? 'id-ID' : 'en-US';
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceUsed(true);
        setVoiceStatusMsg(t.listening);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }
        if (transcript.trim()) {
          setContent((prev) =>
            prev ? `${prev} ${transcript.trim()}` : transcript.trim()
          );
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceStatusMsg(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        setVoiceStatusMsg(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSaveSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const finalTitle =
      title.trim() || currentTemplateMeta.defaultTitle[language];
    const finalContent =
      content.trim() ||
      (template === 'cbt' && cbtData.balancedReframe
        ? cbtData.balancedReframe
        : template === 'unload' && unloadData.gentleNextStep
        ? unloadData.gentleNextStep
        : language === 'en'
        ? 'Quiet reflection.'
        : 'Catatan tenang.');

    AudioEngine.playSingingBowl(528);

    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    const cleanedGratitude = gratitudeList.map((g) => g.trim()).filter(Boolean);
    const isCapsule = template === 'capsule';

    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}

    onSave({
      title: finalTitle,
      content: finalContent,
      template,
      paperTheme,
      fontStyle,
      mood,
      emotions,
      bodySensations,
      energyLevel,
      stickers,
      tags,
      promptUsed,
      affirmationNote: affirmationNote.trim() || undefined,
      gratitudeList: cleanedGratitude.length > 0 ? cleanedGratitude : undefined,
      cbtData: template === 'cbt' ? cbtData : undefined,
      unloadData: template === 'unload' ? unloadData : undefined,
      voiceUsed,
      isFavorite,
      photoUrl,
      photoCaption: photoCaption.trim() || undefined,
      unlockDate: isCapsule ? unlockDate : undefined,
      isUnlocked: isCapsule ? false : true,
    });
  };

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter to save letter
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSaveSubmit();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const formattedDate = new Intl.DateTimeFormat(
    language === 'id' ? 'id-ID' : 'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  ).format(editingEntry ? new Date(editingEntry.createdAt) : new Date());

  const applyCapsulePresetDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setUnlockDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="max-w-3xl mx-auto px-3.5 sm:px-6 py-4 space-y-4 animate-in fade-in duration-200">
      {/* 1. Ultra-Calm Top Bar */}
      <div className="sticky top-14 z-20 bg-paper-bg/95 backdrop-blur-md py-2 flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium text-ink-600 hover:text-ink-900 hover:bg-paper-warm transition flex items-center gap-1 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline">{language === 'en' ? 'Back' : 'Kembali'}</span>
          </button>

          {/* Auto-Save Status Indicator (Mobile-optimized to never overflow) */}
          {!editingEntry && draftStatus !== 'idle' && (
            <div
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-botanical-100/70 text-botanical-800 text-[11px] font-medium shrink-0 max-w-[130px] sm:max-w-none"
              title={
                draftStatus === 'saving'
                  ? language === 'en' ? 'Saving draft...' : 'Menyimpan draft...'
                  : restoredFromDraft
                  ? language === 'en' ? 'Draft restored' : 'Draft dipulihkan'
                  : language === 'en' ? 'Draft saved' : 'Draft tersimpan'
              }
            >
              {draftStatus === 'saving' ? (
                <>
                  <span className="hidden sm:inline">{language === 'en' ? 'Saving draft...' : 'Menyimpan draft...'}</span>
                  <span className="sm:hidden text-[10px]">{language === 'en' ? 'Saving...' : 'Menyimpan...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-3 h-3 text-botanical-700 shrink-0" />
                  <span className="hidden sm:inline">
                    {restoredFromDraft
                      ? language === 'en'
                        ? 'Draft restored'
                        : 'Draft dipulihkan'
                      : language === 'en'
                      ? 'Draft saved'
                      : 'Draft tersimpan'}
                  </span>
                  <span className="sm:hidden text-[10px]">
                    {language === 'en' ? 'Saved' : 'Draft'}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearDraft}
                    className="ml-0.5 text-ink-400 hover:text-rose-600 transition shrink-0"
                    title={language === 'en' ? 'Clear draft' : 'Hapus draft'}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Toggle Paper & Font Drawer */}
          <button
            type="button"
            onClick={() => setShowCustomizeDrawer(!showCustomizeDrawer)}
            className={`p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 shrink-0 ${
              showCustomizeDrawer
                ? 'bg-ink-900 text-white'
                : 'bg-paper-warm/80 text-ink-700 hover:bg-paper-deep'
            }`}
            title={language === 'en' ? 'Paper & Font' : 'Kertas & Font'}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === 'en' ? 'Paper' : 'Kertas'}</span>
          </button>

          {/* Inspire Prompt */}
          <button
            type="button"
            onClick={handleShufflePrompt}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium bg-paper-warm/80 text-ink-700 hover:bg-paper-deep transition flex items-center gap-1 shrink-0"
            title={t.guidedPromptsBtn}
          >
            <Sparkles className="w-3.5 h-3.5 text-amberwarm-600" />
            <span className="hidden md:inline">Prompt</span>
          </button>

          {/* Favorite */}
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 rounded-full text-ink-400 hover:text-amberwarm-500 transition shrink-0"
            title={isFavorite ? 'Starred' : 'Star'}
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'fill-amberwarm-400 text-amberwarm-500' : ''
              }`}
            />
          </button>

          {/* Save / Seal Button (Permanently locked in view & shrink-0) */}
          <button
            type="button"
            onClick={handleSaveSubmit}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 shrink-0 active:scale-95 ${
              template === 'capsule'
                ? 'bg-terracotta-600 hover:bg-terracotta-700'
                : 'bg-botanical-600 hover:bg-botanical-700'
            }`}
          >
            {template === 'capsule' && <Lock className="w-3 h-3 shrink-0" />}
            <span className="whitespace-nowrap">
              {template === 'capsule'
                ? language === 'en'
                  ? 'Seal'
                  : 'Segel'
                : language === 'en'
                ? 'Save'
                : 'Simpan'}
            </span>
          </button>
        </div>
      </div>

      {/* Unified Segmented Pill Mode Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex items-center p-1 rounded-full bg-paper-warm/80 border border-white/70 overflow-x-auto no-scrollbar max-w-full">
          {[
            {
              id: 'freeflow' as TemplateType,
              icon: '🪶',
              label: language === 'en' ? 'Journal' : 'Jurnal',
            },
            {
              id: 'capsule' as TemplateType,
              icon: '💌',
              label: language === 'en' ? 'Time Capsule' : 'Kapsul Waktu',
            },
            {
              id: 'cbt' as TemplateType,
              icon: '🌱',
              label: 'CBT',
            },
            {
              id: 'unload' as TemplateType,
              icon: '🍃',
              label: language === 'en' ? 'Brain Dump' : 'Lepas Beban',
            },
          ].map((mode) => {
            const active = template === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setTemplate(mode.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? 'bg-white text-ink-900 shadow-2xs font-semibold'
                    : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                <span>{mode.icon}</span>
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Collapsible Customization Drawer (Hidden by default so writing is calm!) */}
      {showCustomizeDrawer && (
        <div className="p-4 rounded-3xl bg-white/90 border border-paper-border shadow-paper space-y-4 animate-in fade-in duration-150">
          {/* Journaling Mode */}
          <div>
            <label className="text-[11px] font-medium text-ink-400 uppercase tracking-wider block mb-2">
              {language === 'en' ? 'Journaling Mode' : 'Mode Jurnal'}
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {JOURNAL_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplate(tpl.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 border ${
                    template === tpl.id
                      ? 'bg-botanical-600 text-white border-botanical-600'
                      : 'bg-paper-bg text-ink-700 border-paper-border'
                  }`}
                >
                  <span>{tpl.icon}</span>
                  <span>{tpl.name[language]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paper & Font */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-paper-border/60">
            <div>
              <label className="text-[11px] font-medium text-ink-400 uppercase tracking-wider block mb-2">
                {t.paperStyle}
              </label>
              <div className="flex items-center gap-2">
                {PAPER_THEMES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaperTheme(p.id)}
                    title={p.name[language]}
                    className={`w-8 h-8 rounded-full border transition ${
                      paperTheme === p.id
                        ? 'ring-2 ring-botanical-600 scale-110 border-botanical-600'
                        : 'border-black/20 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: p.swatchBg }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-ink-400 uppercase tracking-wider block mb-2">
                {t.fontStyle}
              </label>
              <div className="flex gap-1.5">
                {[
                  { id: 'serif' as FontStyle, label: 'Serif' },
                  { id: 'sans' as FontStyle, label: 'Sans' },
                  { id: 'handwriting' as FontStyle, label: 'Script' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontStyle(f.id)}
                    className={`px-3 py-1 rounded-full text-xs border transition ${
                      fontStyle === f.id
                        ? 'bg-ink-900 text-white border-ink-900'
                        : 'bg-paper-bg text-ink-700 border-paper-border'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Minimal Sticker Stamp Row */}
          <div className="pt-2 border-t border-paper-border/60">
            <label className="text-[11px] font-medium text-ink-400 uppercase tracking-wider block mb-2">
              {language === 'en' ? 'Page Stickers (Max 4)' : 'Stiker Halaman (Maks 4)'}
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {BOTANICAL_STICKERS.map((st) => {
                const active = stickers.includes(st.id);
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleToggleSticker(st.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border shrink-0 transition ${
                      active
                        ? 'bg-botanical-50 border-botanical-500 scale-105'
                        : 'bg-paper-bg border-transparent hover:border-paper-border'
                    }`}
                  >
                    {st.emoji}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Calm Tactile Paper Sheet */}
      <form onSubmit={handleSaveSubmit}>
        <div
          className={`rounded-[32px] p-6 sm:p-10 shadow-ambient border transition-colors min-h-[70vh] flex flex-col justify-between ${
            currentPaperMeta.cssClass
          } ${
            isDarkPaper
              ? 'border-slate-700/80 text-slate-100'
              : 'border-white/90 text-ink-900'
          }`}
        >
          <div className="space-y-5">
            {/* Quiet Date, Mood Selector & Stickers Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-current/10">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs opacity-55">{formattedDate}</span>

                {/* Inline Mood Pill */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMoodPicker(!showMoodPicker)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-black/5 hover:bg-black/10 transition"
                  >
                    <img
                      src={MOOD_META[mood].iconUrl}
                      alt={MOOD_META[mood].label[language]}
                      className="w-4 h-4 object-contain"
                    />
                    <span>{MOOD_META[mood].label[language]}</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  {showMoodPicker && (
                    <div className="absolute left-0 mt-1.5 w-72 max-h-64 overflow-y-auto p-2.5 rounded-2xl bg-white text-ink-900 shadow-paper-lg border border-paper-border z-30 grid grid-cols-4 gap-1.5">
                      {(Object.keys(MOOD_META) as MoodType[]).map((mKey) => (
                        <button
                          key={mKey}
                          type="button"
                          onClick={() => {
                            setMood(mKey);
                            setShowMoodPicker(false);
                          }}
                          className={`p-1.5 rounded-xl hover:bg-paper-warm transition flex flex-col items-center gap-1 ${
                            mood === mKey ? 'bg-botanical-50 ring-1 ring-botanical-500' : ''
                          }`}
                          title={MOOD_META[mKey].label[language]}
                        >
                          <img
                            src={MOOD_META[mKey].iconUrl}
                            alt={MOOD_META[mKey].label[language]}
                            className="w-7 h-7 object-contain"
                          />
                          <span className="text-[9px] text-ink-700 font-medium truncate w-full text-center">
                            {MOOD_META[mKey].label[language]}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Corner Stickers + Direct Add Button */}
              <div className="relative flex items-center gap-1">
                {stickers.map((stId) => {
                  const st = BOTANICAL_STICKERS.find((s) => s.id === stId);
                  return st ? (
                    <span
                      key={stId}
                      onClick={() => handleToggleSticker(stId)}
                      title={
                        language === 'en'
                          ? `${st.en} (tap to remove)`
                          : `${st.idLabel} (sentuh untuk hapus)`
                      }
                      className="text-xl cursor-pointer hover:scale-110 transition-transform select-none"
                    >
                      {st.emoji}
                    </span>
                  ) : null;
                })}

                <button
                  type="button"
                  onClick={() => setShowStickerPopover(!showStickerPopover)}
                  className="w-6 h-6 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-xs opacity-60 hover:opacity-100 transition ml-0.5"
                  title={language === 'en' ? 'Add sticker emoji' : 'Tambah stiker emoji'}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>

                {showStickerPopover && (
                  <div className="absolute right-0 top-8 w-60 p-3 rounded-2xl bg-white text-ink-900 shadow-paper-lg border border-paper-border z-30 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] text-ink-500">
                      <span className="font-medium">
                        {language === 'en' ? 'Page Stickers (max 4)' : 'Stiker Halaman (maks 4)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowStickerPopover(false)}
                        className="text-ink-400 hover:text-ink-800"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {BOTANICAL_STICKERS.map((st) => {
                        const active = stickers.includes(st.id);
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => handleToggleSticker(st.id)}
                            title={language === 'en' ? st.en : st.idLabel}
                            className={`h-9 rounded-xl flex items-center justify-center text-lg border transition ${
                              active
                                ? 'bg-botanical-50 border-botanical-500 scale-105'
                                : 'bg-paper-bg/70 border-transparent hover:border-paper-border'
                            }`}
                          >
                            {st.emoji}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Time Capsule Unlock Date & Presets if 'capsule' */}
            {template === 'capsule' && (
              <div className="p-4 rounded-2xl bg-terracotta-500/10 border border-terracotta-500/25 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-semibold text-terracotta-800 dark:text-terracotta-300">
                    <Lock className="w-4 h-4" />
                    {language === 'en'
                      ? 'Seal Time-Capsule Letter until:'
                      : 'Segel Surat Kapsul Waktu hingga:'}
                  </span>
                  <input
                    type="date"
                    value={unlockDate}
                    onChange={(e) => setUnlockDate(e.target.value)}
                    className="px-3 py-1 rounded-xl bg-white text-ink-900 border border-terracotta-300 text-xs font-medium"
                  />
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { days: 7, en: '+1 Week', id: '+1 Minggu' },
                    { days: 30, en: '+1 Month', id: '+1 Bulan' },
                    { days: 180, en: '+6 Months', id: '+6 Bulan' },
                    { days: 365, en: '+1 Year', id: '+1 Tahun' },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => applyCapsulePresetDays(preset.days)}
                      className="px-2.5 py-1 rounded-lg bg-white/80 hover:bg-white text-ink-700 border border-terracotta-200 text-[11px] font-medium transition"
                    >
                      {preset[language]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Guiding Prompt if active */}
            {promptUsed && (
              <div className="p-3.5 rounded-2xl bg-amberwarm-500/10 flex items-start justify-between gap-2">
                <p className="font-serif italic text-xs sm:text-sm opacity-85">
                  “{promptUsed}”
                </p>
                <button
                  type="button"
                  onClick={() => setPromptUsed(undefined)}
                  className="opacity-50 hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Page Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                language === 'en' ? 'Give this page a title...' : 'Beri judul tulisanmu...'
              }
              className="w-full bg-transparent font-serif font-medium text-xl sm:text-2xl border-0 focus:outline-none placeholder:opacity-35"
            />

            {/* Calm CBT Reframe Card (Only when template === 'cbt') */}
            {template === 'cbt' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-white/75 text-ink-900 border border-paper-border space-y-4">
                <p className="text-xs font-medium text-botanical-700">
                  🌱{' '}
                  {language === 'en'
                    ? 'Gently untangle a heavy thought'
                    : 'Urai pikiran yang mengganjal secara perlahan'}
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={cbtData.situation}
                    onChange={(e) =>
                      setCbtData({ ...cbtData, situation: e.target.value })
                    }
                    placeholder={
                      language === 'en'
                        ? '1. What happened? (Trigger)'
                        : '1. Situasi apa yang memicu perasaan ini?'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-paper-bg text-ink-900 border border-paper-border text-xs"
                  />

                  <input
                    type="text"
                    value={cbtData.automaticThought}
                    onChange={(e) =>
                      setCbtData({ ...cbtData, automaticThought: e.target.value })
                    }
                    placeholder={
                      language === 'en'
                        ? '2. What negative thought popped up?'
                        : '2. Pikiran negatif apa yang langsung muncul?'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-paper-bg text-ink-900 border border-paper-border text-xs"
                  />

                  <div>
                    <span className="text-[11px] text-ink-500 block mb-1.5">
                      {language === 'en'
                        ? '3. Thinking traps (tap any that fit):'
                        : '3. Pola pikir yang muncul (pilih jika sesuai):'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {COGNITIVE_DISTORTIONS.slice(0, 6).map((dist) => {
                        const active = cbtData.distortions.includes(dist.id);
                        return (
                          <button
                            key={dist.id}
                            type="button"
                            onClick={() => handleToggleDistortion(dist.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] border transition ${
                              active
                                ? 'bg-amberwarm-100 border-amberwarm-400 text-ink-900 font-medium'
                                : 'bg-paper-bg text-ink-600 border-paper-border'
                            }`}
                          >
                            {dist.icon} {dist.name[language]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={cbtData.balancedReframe}
                    onChange={(e) =>
                      setCbtData({ ...cbtData, balancedReframe: e.target.value })
                    }
                    placeholder={
                      language === 'en'
                        ? '4. What is a kinder, more balanced way to look at this?'
                        : '4. Bagaimana sudut pandang baru yang lebih tenang dan adil bagi dirimu?'
                    }
                    className="w-full p-3 rounded-xl bg-botanical-50/70 text-ink-900 border border-botanical-300 text-xs font-serif"
                  />
                </div>
              </div>
            )}

            {/* Calm Circle of Control (Only when template === 'unload') */}
            {template === 'unload' && (
              <div className="p-4 rounded-2xl bg-white/75 text-ink-900 border border-paper-border grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <span className="text-xs font-medium text-botanical-800">
                    🌱 {language === 'en' ? 'In my control' : 'Dalam kendaliku'}
                  </span>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={newWithinItem}
                      onChange={(e) => setNewWithinItem(e.target.value)}
                      placeholder="..."
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-paper-bg border border-paper-border text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newWithinItem.trim()) return;
                        setUnloadData((prev) => ({
                          ...prev,
                          withinControl: [...prev.withinControl, newWithinItem.trim()],
                        }));
                        setNewWithinItem('');
                      }}
                      className="px-2 rounded-lg bg-botanical-600 text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ul className="space-y-1 text-xs">
                    {unloadData.withinControl.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>• {item}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setUnloadData((prev) => ({
                              ...prev,
                              withinControl: prev.withinControl.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="text-ink-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-terracotta-800">
                    ☁️ {language === 'en' ? 'Letting go of' : 'Boleh kulepaskan'}
                  </span>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={newOutsideItem}
                      onChange={(e) => setNewOutsideItem(e.target.value)}
                      placeholder="..."
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-paper-bg border border-paper-border text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newOutsideItem.trim()) return;
                        setUnloadData((prev) => ({
                          ...prev,
                          outsideControl: [...prev.outsideControl, newOutsideItem.trim()],
                        }));
                        setNewOutsideItem('');
                      }}
                      className="px-2 rounded-lg bg-terracotta-600 text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ul className="space-y-1 text-xs opacity-70 line-through">
                    {unloadData.outsideControl.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>• {item}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setUnloadData((prev) => ({
                              ...prev,
                              outsideControl: prev.outsideControl.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="text-ink-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Main Distraction-Free Writing Area */}
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={currentTemplateMeta.placeholder[language]}
              className={`w-full bg-transparent border-0 focus:outline-none resize-none ${fontClass} placeholder:opacity-35`}
            />

            {/* Attached Polaroid Memory Card */}
            {photoUrl && (
              <div className="pt-2 flex justify-center">
                <div className="relative bg-white p-3 pb-4 rounded-2xl shadow-paper-lg border border-paper-border max-w-xs w-full -rotate-1 hover:rotate-0 transition-transform text-ink-900">
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoUrl(undefined);
                      setPhotoCaption('');
                    }}
                    className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-ink-900 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition"
                    title={language === 'en' ? 'Remove photo' : 'Hapus foto'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={photoUrl}
                    alt="Memory"
                    className="w-full max-h-60 object-cover rounded-xl"
                  />
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'Write a small polaroid note...'
                        : 'Tulis catatan kecil di polaroid ini...'
                    }
                    className="w-full mt-2.5 bg-transparent text-center font-handwriting text-xl text-ink-800 placeholder:text-ink-400 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Subtle Bottom Page Footer */}
          <div className="pt-4 mt-6 border-t border-current/10 space-y-4">
            {showExtras && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-black/5 animate-in fade-in">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium opacity-70 block">
                    🌸 {language === 'en' ? 'Gratitude today' : 'Syukur kecil hari ini'}
                  </span>
                  {[0, 1].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={gratitudeList[idx] || ''}
                      onChange={(e) => {
                        const next = [...gratitudeList];
                        next[idx] = e.target.value;
                        setGratitudeList(next);
                      }}
                      placeholder={`${idx + 1}. ...`}
                      className="w-full bg-transparent border-b border-current/15 pb-1 text-xs focus:outline-none"
                    />
                  ))}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-medium opacity-70 block">
                    💛 {language === 'en' ? 'Note to myself' : 'Pesan lembut untuk diriku'}
                  </span>
                  <input
                    type="text"
                    value={affirmationNote}
                    onChange={(e) => setAffirmationNote(e.target.value)}
                    placeholder="..."
                    className="w-full bg-transparent font-handwriting text-lg border-b border-current/15 pb-1 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Tag: #tenang, #pagi"
                    className="w-full bg-transparent text-[11px] opacity-60 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs opacity-70 flex-wrap gap-2">
              <div className="flex items-center gap-3.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleToggleVoiceDictation}
                  className={`flex items-center gap-1 hover:opacity-100 ${
                    isListening ? 'text-rose-500 font-semibold animate-pulse' : ''
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? voiceStatusMsg || 'Listening...' : t.voiceDictation}</span>
                </button>

                <label className="flex items-center gap-1 hover:opacity-100 cursor-pointer">
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Polaroid Photo' : 'Foto Polaroid'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowExtras(!showExtras)}
                  className="hover:opacity-100"
                >
                  {showExtras
                    ? language === 'en'
                      ? '− Hide extras'
                      : '− Sembunyikan'
                    : language === 'en'
                    ? '+ Add gratitude / tags'
                    : '+ Syukur & tag'}
                </button>
              </div>

              <span className="font-mono text-[11px]">
                {content.trim().split(/\s+/).filter(Boolean).length}{' '}
                {language === 'en' ? 'words' : 'kata'}
              </span>
            </div>

            {/* Mobile Bottom Quick Save Button */}
            <div className="pt-2 sm:hidden">
              <button
                type="button"
                onClick={handleSaveSubmit}
                className={`w-full py-2.5 rounded-2xl text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 active:scale-98 transition ${
                  template === 'capsule'
                    ? 'bg-terracotta-600 hover:bg-terracotta-700'
                    : 'bg-botanical-600 hover:bg-botanical-700'
                }`}
              >
                {template === 'capsule' && <Lock className="w-3.5 h-3.5" />}
                <span>
                  {template === 'capsule'
                    ? language === 'en'
                      ? 'Seal Time-Capsule'
                      : 'Segel Kapsul Waktu'
                    : language === 'en'
                    ? 'Save Letter'
                    : 'Simpan Surat'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
