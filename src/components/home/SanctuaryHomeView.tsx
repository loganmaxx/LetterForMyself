import React, { useState } from 'react';
import type {
  JournalEntry,
  MoodCheckIn,
  MoodType,
  TemplateType,
  UserSettings,
} from '../../types';
import {
  DAILY_QUOTES,
  GUIDED_PROMPTS,
  HOME_PRIMARY_MOODS,
  MOOD_META,
} from '../../data/bilingualData';
import {
  ArrowRight,
  Check,
  Lock,
  Unlock,
  Sparkles,
  RefreshCw,
  Feather,
} from 'lucide-react';

interface SanctuaryHomeViewProps {
  settings: UserSettings;
  journals: JournalEntry[];
  moods: MoodCheckIn[];
  onOpenWriteWithTemplate: (template: TemplateType, promptText?: string) => void;
  onSelectJournal: (entry: JournalEntry) => void;
  onQuickMoodLog: (mood: MoodType) => void;
  onOpenFullMoodModal: () => void;
  onGoToNotebook: () => void;
  onGoToInsights: () => void;
}

export const SanctuaryHomeView: React.FC<SanctuaryHomeViewProps> = ({
  settings,
  journals,
  moods,
  onOpenWriteWithTemplate,
  onSelectJournal,
  onQuickMoodLog,
  onOpenFullMoodModal,
  onGoToNotebook,
}) => {
  const lang = settings.language;
  const [justLoggedMood, setJustLoggedMood] = useState<MoodType | null>(null);
  const [promptIdx, setPromptIdx] = useState<number>(
    () => new Date().getDate() % GUIDED_PROMPTS.length
  );

  const quoteIndex = new Date().getDate() % DAILY_QUOTES.length;
  const dailyQuote = DAILY_QUOTES[quoteIndex];
  const currentPrompt = GUIDED_PROMPTS[promptIdx] || GUIDED_PROMPTS[0];
  const nowStr = new Date().toISOString().split('T')[0];

  // Dynamic time-of-day greeting
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 11
      ? { en: 'Good morning', id: 'Selamat pagi' }
      : hour < 15
      ? { en: 'Good afternoon', id: 'Selamat siang' }
      : hour < 19
      ? { en: 'Good evening', id: 'Selamat sore' }
      : { en: 'Quiet night', id: 'Selamat malam' };

  const latestMood = moods[0]?.mood ? MOOD_META[moods[0].mood] : null;

  const readyCapsules = journals.filter(
    (j) =>
      j.template === 'capsule' &&
      !j.isUnlocked &&
      !!j.unlockDate &&
      j.unlockDate <= nowStr
  );
  const upcomingCapsules = journals.filter(
    (j) =>
      j.template === 'capsule' &&
      !j.isUnlocked &&
      !!j.unlockDate &&
      j.unlockDate > nowStr
  );

  const handleQuickMood = (m: MoodType) => {
    setJustLoggedMood(m);
    onQuickMoodLog(m);
    setTimeout(() => setJustLoggedMood(null), 2500);
  };

  const handleShuffleDailyPrompt = () => {
    setPromptIdx((prev) => (prev + 1) % GUIDED_PROMPTS.length);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-6">
      {/* 1. Dynamic Time-of-Day Hero Card + Today's Mood Companion */}
      <section className="relative overflow-hidden rounded-[28px] bg-botanical-800 text-paper-bg px-6 py-6 sm:px-8 sm:py-7 shadow-paper-lg">
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-botanical-600/35 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-terracotta-500/20 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-botanical-200 tracking-[0.22em] uppercase">
              {new Date().toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </p>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-paper-bg font-normal tracking-tight">
              {timeGreeting[lang]},{' '}
              <span className="italic text-amberwarm-200">{settings.name}</span>.
            </h1>
          </div>

          {/* Today's 3D Mood Companion Badge */}
          {latestMood && (
            <div
              onClick={onOpenFullMoodModal}
              className="shrink-0 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 flex items-center gap-2.5 cursor-pointer transition"
              title={lang === 'en' ? 'Current mood' : 'Perasaan saat ini'}
            >
              <img
                src={latestMood.iconUrl}
                alt={latestMood.label[lang]}
                className="w-7 h-7 object-contain"
              />
              <span className="text-xs font-medium text-paper-bg hidden sm:inline">
                {latestMood.label[lang]}
              </span>
            </div>
          )}
        </div>

        <p className="relative font-serif italic text-xs sm:text-sm text-botanical-100/90 leading-relaxed pt-3.5 mt-3.5 border-t border-white/10 max-w-2xl">
          “{dailyQuote.text[lang]}”
        </p>
      </section>

      {/* Responsive Desktop 2-Column Grid (1 Column on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (7 cols on desktop): Mood Bar + Daily Reflection Prompt */}
        <div className="lg:col-span-7 space-y-6">
          {/* 2. Quick 1-Row Mood Check-In */}
          <section className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-600">
                {lang === 'en'
                  ? 'How does your heart feel?'
                  : 'Bagaimana perasaanmu saat ini?'}
              </span>
              <button
                onClick={onOpenFullMoodModal}
                className="text-xs font-semibold text-botanical-700 hover:text-botanical-900 transition"
              >
                {lang === 'en' ? '+ More emotions' : '+ Emosi lainnya'}
              </button>
            </div>

            <div className="p-1.5 rounded-2xl bg-[#E8E0D2]/85 backdrop-blur-md shadow-inner border border-white/60">
              {justLoggedMood ? (
                <div className="py-2.5 px-4 rounded-xl bg-white text-botanical-800 text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 text-botanical-600" />
                  <span>
                    {lang === 'en'
                      ? `Saved "${MOOD_META[justLoggedMood].label.en}"`
                      : `Perasaan "${MOOD_META[justLoggedMood].label.id}" tersimpan`}
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-1">
                  {HOME_PRIMARY_MOODS.map((mKey) => {
                    const m = MOOD_META[mKey];
                    const isLatest = moods[0]?.mood === mKey;
                    return (
                      <button
                        key={mKey}
                        onClick={() => handleQuickMood(mKey)}
                        className={`group py-1.5 px-1 rounded-xl text-center transition-all duration-200 active:scale-95 flex flex-col items-center gap-1 ${
                          isLatest
                            ? 'bg-white shadow-2xs'
                            : 'hover:bg-white/70 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={m.iconUrl}
                          alt={m.label[lang]}
                          className="w-6 h-6 sm:w-7 sm:h-7 object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                        <span
                          className={`text-[10px] leading-tight truncate w-full ${
                            isLatest ? 'text-ink-900 font-semibold' : 'text-ink-700 font-medium'
                          }`}
                        >
                          {m.label[lang]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* 3. Daily Reflection Prompt Card */}
          <section className="rounded-[26px] bg-white/95 border border-white shadow-ambient p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-terracotta-600">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'en' ? "Today's Reflection Prompt" : 'Pertanyaan Refleksi Hari Ini'}
              </span>
              <button
                type="button"
                onClick={handleShuffleDailyPrompt}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium text-ink-500 hover:text-ink-900 hover:bg-paper-warm transition flex items-center gap-1"
                title={lang === 'en' ? 'Try another question' : 'Ganti pertanyaan'}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{lang === 'en' ? 'Shuffle' : 'Ganti'}</span>
              </button>
            </div>

            <p className="font-serif text-lg sm:text-xl text-ink-900 leading-snug">
              “{currentPrompt[lang]}”
            </p>

            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onOpenWriteWithTemplate('freeflow', currentPrompt[lang])}
                className="px-4 py-2 rounded-full bg-botanical-800 hover:bg-botanical-700 text-paper-bg text-xs font-medium inline-flex items-center gap-1.5 transition shadow-2xs"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>
                  {lang === 'en' ? 'Answer in Journal' : 'Tulis Jawaban di Jurnal'}
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN (5 cols on desktop): Time Capsule Banner + Latest Pages */}
        <div className="lg:col-span-5 space-y-4">
          {/* Time-Capsule Notification Banner */}
          {readyCapsules.length > 0 ? (
            <section>
              <div
                onClick={() => onSelectJournal(readyCapsules[0])}
                className="p-4 rounded-[24px] bg-terracotta-600 text-white shadow-paper cursor-pointer hover:bg-terracotta-700 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <Unlock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta-100 block">
                      {lang === 'en' ? 'Time Capsule Ready!' : 'Kapsul Waktu Siap Dibuka!'}
                    </span>
                    <h3 className="font-serif font-medium text-sm truncate">
                      {readyCapsules[0].title}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-terracotta-700 text-xs font-semibold shrink-0">
                  {lang === 'en' ? 'Open' : 'Buka'}
                </span>
              </div>
            </section>
          ) : upcomingCapsules.length > 0 ? (
            <section>
              <div
                onClick={() => onSelectJournal(upcomingCapsules[0])}
                className="px-4 py-3 rounded-[20px] bg-[#E8E0D2]/90 border border-white/70 text-ink-800 cursor-pointer hover:bg-[#E2D8C7] transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0 text-xs">
                  <Lock className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                  <span className="truncate">
                    {lang === 'en'
                      ? `${upcomingCapsules.length} Time Capsule sealed (${upcomingCapsules[0].unlockDate})`
                      : `${upcomingCapsules.length} Kapsul Waktu (${upcomingCapsules[0].unlockDate})`}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-ink-500 shrink-0" />
              </div>
            </section>
          ) : null}

          {/* Latest Reflections */}
          {journals.length > 0 && (
            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-600">
                  {lang === 'en' ? 'Latest Pages' : 'Catatan Terakhir'}
                </span>
                <button
                  onClick={onGoToNotebook}
                  className="text-xs font-semibold text-botanical-700 hover:text-botanical-900 flex items-center gap-1 transition"
                >
                  <span>
                    {lang === 'en'
                      ? `All ${journals.length} entries`
                      : `Lihat semua (${journals.length})`}
                  </span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {journals.slice(0, 3).map((entry) => {
                  const moodMeta = MOOD_META[entry.mood] || MOOD_META.peaceful;
                  const dateObj = new Date(entry.createdAt);
                  const dayNum = String(dateObj.getDate()).padStart(2, '0');
                  const monthShort = dateObj.toLocaleDateString(
                    lang === 'id' ? 'id-ID' : 'en-US',
                    { month: 'short' }
                  );
                  const isSealed =
                    entry.template === 'capsule' &&
                    !entry.isUnlocked &&
                    !!entry.unlockDate &&
                    entry.unlockDate > nowStr;

                  return (
                    <div
                      key={entry.id}
                      onClick={() => onSelectJournal(entry)}
                      className="group p-3.5 rounded-[22px] bg-white/90 hover:bg-white shadow-ambient border border-white hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-3"
                    >
                      {/* Solid Tinted Date Badge */}
                      <div className="w-11 h-11 rounded-2xl bg-botanical-100/80 text-botanical-900 shrink-0 flex flex-col items-center justify-center">
                        <div className="font-serif text-base font-semibold leading-none">
                          {dayNum}
                        </div>
                        <div className="text-[9px] font-bold uppercase tracking-wider text-botanical-700 mt-0.5">
                          {monthShort}
                        </div>
                      </div>

                      {/* Title & Excerpt */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif font-medium text-sm sm:text-base text-ink-900 truncate group-hover:text-botanical-800 transition-colors">
                          {entry.title}
                        </h3>
                        {isSealed ? (
                          <p className="text-xs text-terracotta-600 flex items-center gap-1 mt-0.5">
                            <Lock className="w-3 h-3" />
                            <span>
                              {lang === 'en'
                                ? `Time capsule (${entry.unlockDate})`
                                : `Kapsul waktu (${entry.unlockDate})`}
                            </span>
                          </p>
                        ) : (
                          <p className="text-xs text-ink-500 line-clamp-1 mt-0.5">
                            {entry.content}
                          </p>
                        )}
                      </div>

                      {/* 3D Emotion Icon */}
                      <div className="shrink-0 pl-1">
                        <img
                          src={moodMeta.iconUrl}
                          alt={moodMeta.label[lang]}
                          className="w-6 h-6 sm:w-7 sm:h-7 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
