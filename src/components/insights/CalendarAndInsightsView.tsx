import React, { useState } from 'react';
import type { JournalEntry, Language, MoodCheckIn, MoodType } from '../../types';
import { MOOD_META } from '../../data/bilingualData';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';

interface CalendarAndInsightsViewProps {
  journals: JournalEntry[];
  moods: MoodCheckIn[];
  language: Language;
  onSelectJournal: (entry: JournalEntry) => void;
  onOpenMoodModal: () => void;
  onDeleteMood: (id: string) => void;
  onOpenWrite: () => void;
}

export const CalendarAndInsightsView: React.FC<CalendarAndInsightsViewProps> = ({
  journals,
  moods,
  language,
  onSelectJournal,
  onOpenMoodModal,
  onDeleteMood,
}) => {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells: (string | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(
      `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    );
  }

  const journalsByDate: Record<string, JournalEntry[]> = {};
  journals.forEach((j) => {
    const dStr = j.createdAt.split('T')[0];
    if (!journalsByDate[dStr]) journalsByDate[dStr] = [];
    journalsByDate[dStr].push(j);
  });

  const moodsByDate: Record<string, MoodCheckIn[]> = {};
  moods.forEach((m) => {
    const dStr = m.timestamp.split('T')[0];
    if (!moodsByDate[dStr]) moodsByDate[dStr] = [];
    moodsByDate[dStr].push(m);
  });

  const selectedJournals = journalsByDate[selectedDateStr] || [];
  const selectedMoods = moodsByDate[selectedDateStr] || [];

  // Monthly Summary Insights for the currently viewed month
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthJournals = journals.filter((j) => j.createdAt.startsWith(monthPrefix));
  const monthMoods = moods.filter((m) => m.timestamp.startsWith(monthPrefix));

  const activeDateSet = new Set<string>();
  const moodCounts: Partial<Record<MoodType, number>> = {};

  monthJournals.forEach((j) => {
    activeDateSet.add(j.createdAt.split('T')[0]);
    moodCounts[j.mood] = (moodCounts[j.mood] || 0) + 1;
  });
  monthMoods.forEach((m) => {
    activeDateSet.add(m.timestamp.split('T')[0]);
    moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
  });

  const sortedMoodKeys = (Object.keys(moodCounts) as MoodType[]).sort(
    (a, b) => (moodCounts[b] || 0) - (moodCounts[a] || 0)
  );
  const topMood: MoodType | undefined = sortedMoodKeys[0];
  const topMoodMeta = topMood ? MOOD_META[topMood] : null;

  const dayNames =
    language === 'id'
      ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5">
      {/* Solid Botanical Header Banner */}
      <div className="rounded-[26px] bg-botanical-800 text-paper-bg px-6 py-5 shadow-paper flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-botanical-200">
            {language === 'en' ? 'Mood & Reflections' : 'Perasaan & Catatan'}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-paper-bg tracking-tight mt-0.5">
            {language === 'en' ? 'Emotional Calendar' : 'Kalender Perasaan'}
          </h1>
        </div>
        <button
          onClick={onOpenMoodModal}
          className="px-3.5 py-2 rounded-full bg-terracotta-500 hover:bg-terracotta-400 text-white text-xs font-medium flex items-center gap-1 transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Log Mood' : 'Catat'}</span>
        </button>
      </div>

      {/* Gentle Monthly Summary Strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/90 border border-white shadow-ambient flex items-center gap-2.5">
          {topMoodMeta ? (
            <img
              src={topMoodMeta.iconUrl}
              alt={topMoodMeta.label[language]}
              className="w-8 h-8 object-contain shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-botanical-100/80 shrink-0" />
          )}
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 block">
              {language === 'en' ? 'Top Mood' : 'Dominan'}
            </span>
            <span className="font-serif font-medium text-sm text-ink-900 truncate block">
              {topMoodMeta ? topMoodMeta.label[language] : '—'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/90 border border-white shadow-ambient">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 block">
            {language === 'en' ? 'Letters' : 'Surat Ditulis'}
          </span>
          <span className="font-serif font-medium text-lg text-ink-900 mt-0.5 block">
            {monthJournals.length}{' '}
            <span className="text-xs font-sans text-ink-500 font-normal">
              {language === 'en' ? 'pages' : 'halaman'}
            </span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/90 border border-white shadow-ambient">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400 block">
            {language === 'en' ? 'Active Days' : 'Hari Tercatat'}
          </span>
          <span className="font-serif font-medium text-lg text-ink-900 mt-0.5 block">
            {activeDateSet.size}{' '}
            <span className="text-xs font-sans text-ink-500 font-normal">
              {language === 'en' ? 'days' : 'hari'}
            </span>
          </span>
        </div>
      </div>

      {/* Responsive 2-Column Layout on Desktop (Calendar Left, Selected Day Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Clean Monthly Calendar */}
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-3xl bg-white/90 border border-white shadow-ambient space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-medium text-lg text-ink-900">
              {viewMonth.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMonth(new Date(year, month - 1, 1))}
                className="p-1.5 rounded-full hover:bg-paper-warm text-ink-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMonth(new Date(year, month + 1, 1))}
                className="p-1.5 rounded-full hover:bg-paper-warm text-ink-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {dayNames.map((d) => (
              <div key={d} className="text-[10px] text-ink-400 py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((dateIso, idx) => {
              if (!dateIso) return <div key={`empty-${idx}`} className="h-11" />;
              const dayNum = Number(dateIso.split('-')[2]);
              const dayJournals = journalsByDate[dateIso] || [];
              const dayMoods = moodsByDate[dateIso] || [];
              const primaryMood: MoodType | undefined =
                dayMoods[0]?.mood || dayJournals[0]?.mood;
              const isSelected = dateIso === selectedDateStr;

              return (
                <button
                  key={dateIso}
                  onClick={() => setSelectedDateStr(dateIso)}
                  className={`h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition relative ${
                    isSelected
                      ? 'bg-botanical-800 text-white font-semibold'
                      : primaryMood
                      ? 'bg-paper-warm/70 text-ink-900'
                      : 'hover:bg-paper-warm/40 text-ink-600'
                  }`}
                >
                  <span className="text-xs leading-none">
                    {primaryMood ? (
                      <img
                        src={MOOD_META[primaryMood].iconUrl}
                        alt={MOOD_META[primaryMood].label[language]}
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      dayNum
                    )}
                  </span>
                  {primaryMood && (
                    <span className="text-[9px] opacity-70 leading-none">{dayNum}</span>
                  )}
                  {dayJournals.length > 0 && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-botanical-600 absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Notes */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-600 px-1 block">
            {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString(
              language === 'id' ? 'id-ID' : 'en-US',
              { weekday: 'long', month: 'short', day: 'numeric' }
            )}
          </span>

          {selectedJournals.length === 0 && selectedMoods.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white/60 border border-white text-center text-xs text-ink-400">
              {language === 'en'
                ? 'Quiet day — no entries recorded.'
                : 'Hari yang tenang — belum ada catatan.'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedJournals.map((j) => (
                <div
                  key={j.id}
                  onClick={() => onSelectJournal(j)}
                  className="p-4 rounded-2xl bg-white/95 border border-white shadow-ambient cursor-pointer hover:-translate-y-0.5 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="font-serif font-medium text-sm text-ink-900 truncate">
                      {j.title}
                    </h4>
                    <p className="text-xs text-ink-500 line-clamp-1 mt-0.5">{j.content}</p>
                  </div>
                  <img
                    src={MOOD_META[j.mood].iconUrl}
                    alt={MOOD_META[j.mood].label[language]}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                </div>
              ))}

              {selectedMoods.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-white/80 border border-white shadow-ambient flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={MOOD_META[m.mood].iconUrl}
                      alt={MOOD_META[m.mood].label[language]}
                      className="w-6 h-6 object-contain shrink-0"
                    />
                    <div>
                      <span className="font-medium text-ink-800">
                        {MOOD_META[m.mood].label[language]}
                      </span>
                      {m.note && <p className="text-ink-500 mt-0.5">“{m.note}”</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteMood(m.id)}
                    className="text-ink-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
