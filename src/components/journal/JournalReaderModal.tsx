import React, { useState, useEffect } from 'react';
import type { JournalEntry, Language } from '../../types';
import {
  BODY_SENSATIONS,
  BOTANICAL_STICKERS,
  COGNITIVE_DISTORTIONS,
  EMOTION_OPTIONS,
  JOURNAL_TEMPLATES,
  MOOD_META,
  PAPER_THEMES,
} from '../../data/bilingualData';
import { AudioEngine } from '../../services/audioService';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Star,
  Calendar,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  HeartHandshake,
  Tag,
  Printer,
} from 'lucide-react';

interface JournalReaderPageProps {
  entry: JournalEntry | null;
  language: Language;
  onClose: () => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUnlockCapsule: (id: string, reflection?: string) => void;
}

export const JournalReaderModal: React.FC<JournalReaderPageProps> = ({
  entry,
  language,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUnlockCapsule,
}) => {
  const [reflectionInput, setReflectionInput] = useState(
    entry?.reflectionAfterOpening || ''
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [entry?.id]);

  if (!entry) return null;

  const paperMeta =
    PAPER_THEMES.find((p) => p.id === entry.paperTheme) || PAPER_THEMES[0];
  const tplMeta =
    JOURNAL_TEMPLATES.find((tpl) => tpl.id === entry.template) ||
    JOURNAL_TEMPLATES[0];
  const moodMeta = MOOD_META[entry.mood] || MOOD_META.peaceful;
  const isDark = !!paperMeta.isDark;

  const fontClass =
    entry.fontStyle === 'serif'
      ? 'font-serif text-lg leading-relaxed'
      : entry.fontStyle === 'handwriting'
      ? 'font-handwriting text-2xl leading-relaxed tracking-wide'
      : 'font-sans text-base leading-relaxed';

  const nowStr = new Date().toISOString().split('T')[0];
  const isSealedCapsule = entry.template === 'capsule' && !entry.isUnlocked;
  const isReadyToOpen =
    isSealedCapsule && !!entry.unlockDate && entry.unlockDate <= nowStr;

  const handleBreakSeal = () => {
    AudioEngine.playSingingBowl(528);
    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
    onUnlockCapsule(entry.id);
  };

  return (
    <div className="max-w-3xl mx-auto px-3.5 sm:px-6 py-4 space-y-4 animate-in fade-in duration-200">
      {/* 1. Sticky Full-Page Reader Top Bar */}
      <div className="no-print sticky top-14 z-20 bg-paper-bg/95 backdrop-blur-md py-2 flex items-center justify-between gap-2">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-full text-xs font-medium text-ink-600 hover:text-ink-900 hover:bg-paper-warm transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back' : 'Kembali'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-ink-500 bg-paper-warm/60">
            <span>{tplMeta.icon}</span>
            <span>{tplMeta.name[language]}</span>
          </span>

          <button
            onClick={() => window.print()}
            className="p-2 rounded-full text-ink-400 hover:text-ink-900 hover:bg-paper-warm transition"
            title={language === 'en' ? 'Print / Save PDF' : 'Cetak / Simpan PDF'}
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleFavorite(entry.id)}
            className="p-2 rounded-full text-ink-400 hover:text-amberwarm-500 transition"
            title="Favorite"
          >
            <Star
              className={`w-4 h-4 ${
                entry.isFavorite ? 'fill-amberwarm-400 text-amberwarm-500' : ''
              }`}
            />
          </button>

          <button
            onClick={() => onEdit(entry)}
            className="px-3.5 py-1.5 rounded-full bg-paper-warm hover:bg-paper-deep text-ink-800 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Edit' : 'Sunting'}</span>
          </button>

          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-full text-ink-400 hover:text-rose-600 hover:bg-rose-50 transition"
            title={language === 'en' ? 'Delete' : 'Hapus'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Delete Confirmation Popup Modal */}
      {confirmDelete && (
        <div
          className="no-print fixed inset-0 z-50 bg-ink-900/55 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-paper-bg border border-paper-border p-6 shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-medium text-ink-900">
                {language === 'en'
                  ? 'Delete this letter?'
                  : 'Hapus halaman surat ini?'}
              </h3>
              <p className="text-xs text-ink-500 leading-relaxed">
                {language === 'en'
                  ? 'This memory will be permanently removed from your sanctuary notebook.'
                  : 'Catatan ini akan dihapus permanen dari buku jurnalmu dan tidak bisa dikembalikan.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="py-2.5 px-4 rounded-xl bg-paper-warm hover:bg-paper-deep text-ink-700 text-xs font-semibold transition"
              >
                {language === 'en' ? 'Cancel' : 'Batal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(entry.id);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold shadow-sm transition"
              >
                {language === 'en' ? 'Yes, Delete' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Full-Page Tactile Journal Sheet */}
      {isSealedCapsule ? (
        <div className="p-8 sm:p-14 rounded-3xl paper-parchment border border-paper-border text-center space-y-5 shadow-notebook min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-terracotta-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-700">
              {isReadyToOpen
                ? language === 'en'
                  ? 'Time Capsule Ready to Open!'
                  : 'Kapsul Waktu Siap Dibuka Hari Ini!'
                : language === 'en'
                ? 'Sealed Time-Capsule Letter'
                : 'Surat Kapsul Waktu Tersegel'}
            </span>
            <h1 className="font-serif font-medium text-2xl text-ink-900 mt-1">
              {entry.title}
            </h1>
            <p className="text-xs text-ink-600 mt-2 max-w-md mx-auto leading-relaxed">
              {isReadyToOpen
                ? language === 'en'
                  ? `The day has arrived (${entry.unlockDate}). Take a slow breath and break the wax seal to read the message from your past self.`
                  : `Waktunya telah tiba (${entry.unlockDate}). Tarik napas pelan dan buka segel lilinnya untuk membaca surat dari dirimu di masa lalu.`
                : language === 'en'
                ? `Scheduled to unlock on ${entry.unlockDate}. You can wait until that day arrives, or break the wax seal early if you need these words today.`
                : `Dijadwalkan terbuka pada ${entry.unlockDate}. Kamu bisa menunggu hingga tanggal tersebut, atau membuka segelnya sekarang jika hatimu membutuhkannya.`}
            </p>
          </div>
          <button
            onClick={handleBreakSeal}
            className="px-6 py-3 rounded-full bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs sm:text-sm font-medium shadow-sm inline-flex items-center gap-2 transition"
          >
            <Unlock className="w-4 h-4" />
            <span>
              {language === 'en'
                ? 'Break Wax Seal & Read Letter'
                : 'Buka Segel & Baca Surat'}
            </span>
          </button>
        </div>
      ) : (
        <article
          className={`rounded-[32px] p-6 sm:p-10 shadow-ambient border min-h-[68vh] flex flex-col justify-between ${
            paperMeta.cssClass
          } ${
            isDark
              ? 'border-slate-700/80 text-slate-100'
              : 'border-white/90 text-ink-900'
          }`}
        >
          <div>
            {/* Date, Mood & Stickers Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 mb-6 border-b border-current/10">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs opacity-60">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(entry.createdAt).toLocaleDateString(
                      language === 'id' ? 'id-ID' : 'en-US',
                      {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/5">
                    <img
                      src={moodMeta.iconUrl}
                      alt={moodMeta.label[language]}
                      className="w-4 h-4 object-contain"
                    />
                    {moodMeta.label[language]}
                  </span>
                  {entry.emotions.map((emoId) => {
                    const found = EMOTION_OPTIONS.find((e) => e.id === emoId);
                    if (!found) return null;
                    return (
                      <span
                        key={emoId}
                        className="text-xs px-2 py-0.5 rounded-full bg-black/5 opacity-75"
                      >
                        {language === 'en' ? found.en : found.idLabel}
                      </span>
                    );
                  })}
                  {entry.bodySensations?.map((bId) => {
                    const bs = BODY_SENSATIONS.find((b) => b.id === bId);
                    if (!bs) return null;
                    return (
                      <span
                        key={bId}
                        className="text-xs px-2 py-0.5 rounded-full bg-black/5 opacity-75"
                      >
                        {bs.icon} {language === 'en' ? bs.en : bs.idLabel}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Stickers */}
              {entry.stickers?.length > 0 && (
                <div className="flex items-center gap-1">
                  {entry.stickers.map((stId) => {
                    const st = BOTANICAL_STICKERS.find((s) => s.id === stId);
                    if (!st) return null;
                    return (
                      <span
                        key={stId}
                        className="text-2xl"
                        title={language === 'en' ? st.en : st.idLabel}
                      >
                        {st.emoji}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Prompt Used */}
            {entry.promptUsed && (
              <div className="mb-5 p-3.5 rounded-2xl bg-amberwarm-500/10 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amberwarm-600 shrink-0 mt-0.5" />
                <p className="font-serif italic text-xs sm:text-sm">
                  “{entry.promptUsed}”
                </p>
              </div>
            )}

            {/* Title */}
            <h1 className="font-serif font-medium text-2xl sm:text-3xl mb-5">
              {entry.title}
            </h1>

            {/* CBT Thought Reframe Card if present */}
            {entry.cbtData && (
              <div className="my-5 p-4 sm:p-5 rounded-2xl bg-white/85 text-ink-900 border border-paper-border space-y-3">
                <span className="text-xs font-medium text-botanical-700 block">
                  🌱 {language === 'en' ? 'CBT Thought Reframe' : 'Reframe Pikiran (CBT)'}
                </span>

                {entry.cbtData.situation && (
                  <p className="text-xs opacity-75">{entry.cbtData.situation}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-terracotta-50/70 text-ink-900 border border-terracotta-200/80">
                    <span className="text-[10px] uppercase text-terracotta-800 block">
                      {language === 'en' ? 'Automatic Thought' : 'Pikiran Otomatis'}
                    </span>
                    <p className="text-xs italic mt-1">
                      “{entry.cbtData.automaticThought}”
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-botanical-50/80 text-ink-900 border border-botanical-200">
                    <span className="text-[10px] uppercase text-botanical-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-botanical-600" />
                      {language === 'en' ? 'Kinder Perspective' : 'Sudut Pandang Baru'}
                    </span>
                    <p className="text-xs font-serif mt-1">
                      “{entry.cbtData.balancedReframe}”
                    </p>
                  </div>
                </div>

                {entry.cbtData.distortions?.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {entry.cbtData.distortions.map((dId) => {
                      const d = COGNITIVE_DISTORTIONS.find((item) => item.id === dId);
                      if (!d) return null;
                      return (
                        <span
                          key={dId}
                          className="px-2.5 py-0.5 rounded-full text-[11px] bg-amberwarm-100/80 text-amberwarm-900"
                        >
                          {d.icon} {d.name[language]}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Anxiety Unload Circle of Control if present */}
            {entry.unloadData && (
              <div className="my-5 p-4 rounded-2xl bg-white/85 text-ink-900 border border-paper-border grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-botanical-50/70 border border-botanical-200/60">
                  <h4 className="text-xs font-medium text-botanical-800 mb-1">
                    🌱 {language === 'en' ? 'In my control' : 'Dalam kendaliku'}
                  </h4>
                  <ul className="space-y-1 text-xs">
                    {entry.unloadData.withinControl.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-xl bg-terracotta-50/70 border border-terracotta-200/60">
                  <h4 className="text-xs font-medium text-terracotta-800 mb-1">
                    ☁️ {language === 'en' ? 'Letting go of' : 'Dilepaskan'}
                  </h4>
                  <ul className="space-y-1 text-xs line-through opacity-80">
                    {entry.unloadData.outsideControl.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Main Journal Body */}
            <div className={`whitespace-pre-wrap ${fontClass}`}>
              {entry.content}
            </div>

            {/* Polaroid Memory Photo if attached */}
            {entry.photoUrl && (
              <div className="mt-7 flex justify-center">
                <div className="bg-white p-3 pb-4 rounded-2xl shadow-paper-lg border border-paper-border max-w-xs w-full -rotate-1 hover:rotate-0 transition-transform text-ink-900">
                  <img
                    src={entry.photoUrl}
                    alt={entry.photoCaption || entry.title}
                    className="w-full max-h-64 object-cover rounded-xl"
                  />
                  {entry.photoCaption && (
                    <p className="mt-2.5 text-center font-handwriting text-xl text-ink-800">
                      {entry.photoCaption}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Gratitudes, Affirmation & Tags Footer */}
          <div className="mt-8 pt-5 border-t border-current/10 space-y-4">
            {(entry.gratitudeList?.length || entry.affirmationNote) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {entry.gratitudeList && entry.gratitudeList.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-black/5">
                    <h4 className="text-[11px] uppercase tracking-wider opacity-65 mb-1.5">
                      🌸 {language === 'en' ? 'Gratitude' : 'Syukur Kecil'}
                    </h4>
                    <ul className="space-y-1 text-xs">
                      {entry.gratitudeList.map((g, i) => (
                        <li key={i}>
                          {i + 1}. {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {entry.affirmationNote && (
                  <div className="p-3.5 rounded-2xl bg-black/5">
                    <h4 className="text-[11px] uppercase tracking-wider opacity-65 flex items-center gap-1 mb-1">
                      <HeartHandshake className="w-3 h-3" />
                      {language === 'en' ? 'Note to myself' : 'Pesan untuk diriku'}
                    </h4>
                    <p className="font-handwriting text-xl">{entry.affirmationNote}</p>
                  </div>
                )}
              </div>
            )}

            {/* Post-Opening Capsule Reflection if Capsule */}
            {entry.template === 'capsule' && (
              <div className="pt-2">
                <label className="text-xs opacity-70 block mb-1.5">
                  💌{' '}
                  {language === 'en'
                    ? 'How does reading this Time-Capsule feel today?'
                    : 'Bagaimana perasaanmu membaca surat kapsul waktu ini hari ini?'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    placeholder={
                      language === 'en'
                        ? 'Write a note back to your past self...'
                        : 'Tulis balasan singkat untuk dirimu di masa lalu...'
                    }
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white/80 text-ink-900 border border-paper-border text-xs"
                  />
                  <button
                    onClick={() => onUnlockCapsule(entry.id, reflectionInput)}
                    className="px-4 py-1.5 rounded-xl bg-botanical-600 text-white text-xs font-medium"
                  >
                    {language === 'en' ? 'Save' : 'Simpan'}
                  </button>
                </div>
              </div>
            )}

            {entry.tags?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap opacity-60 text-xs">
                <Tag className="w-3 h-3" />
                {entry.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </article>
      )}
    </div>
  );
};
