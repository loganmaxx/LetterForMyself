import React, { useState } from 'react';
import type { JournalEntry, Language, TemplateType } from '../../types';
import { MOOD_META } from '../../data/bilingualData';
import {
  Search,
  Lock,
  Sparkles,
} from 'lucide-react';

interface NotebookShelfViewProps {
  journals: JournalEntry[];
  language: Language;
  onOpenWriteWithTemplate: (tpl: TemplateType) => void;
  onSelectEntry: (entry: JournalEntry) => void;
  onToggleFavorite: (id: string) => void;
}

export const NotebookShelfView: React.FC<NotebookShelfViewProps> = ({
  journals,
  language,
  onSelectEntry,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const nowStr = new Date().toISOString().split('T')[0];

  const filtered = journals.filter((entry) => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const inTitle = entry.title.toLowerCase().includes(q);
      const inContent = entry.content.toLowerCase().includes(q);
      const inTags = entry.tags?.some((tag) => tag.toLowerCase().includes(q));
      if (!inTitle && !inContent && !inTags) return false;
    }

    if (selectedFilter === 'favorites') return entry.isFavorite;
    if (selectedFilter === 'cbt') return entry.template === 'cbt';
    if (selectedFilter === 'capsule') return entry.template === 'capsule';
    return true;
  });

  const tabs = [
    { id: 'all', label: language === 'en' ? 'All' : 'Semua' },
    { id: 'favorites', label: language === 'en' ? 'Starred' : 'Favorit' },
    { id: 'cbt', label: 'CBT' },
    { id: 'capsule', label: language === 'en' ? 'Time Capsule' : 'Kapsul Waktu' },
  ];

  const handleOpenRandomEntry = () => {
    const unlockedPool = journals.filter(
      (j) =>
        j.template !== 'capsule' ||
        j.isUnlocked ||
        (j.unlockDate && j.unlockDate <= nowStr)
    );
    if (unlockedPool.length === 0) return;
    const pick = unlockedPool[Math.floor(Math.random() * unlockedPool.length)];
    onSelectEntry(pick);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5">
      {/* Solid Botanical Header Banner */}
      <div className="rounded-[26px] bg-botanical-800 text-paper-bg px-6 py-5 shadow-paper flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-botanical-200">
            {language === 'en' ? 'Personal Archive' : 'Arsip Pribadi'}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-paper-bg tracking-tight mt-0.5">
            {language === 'en' ? 'My Journal' : 'Jurnal Saya'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {journals.length > 1 && (
            <button
              onClick={handleOpenRandomEntry}
              className="px-3.5 py-1.5 rounded-full bg-terracotta-500 hover:bg-terracotta-400 text-white text-xs font-medium inline-flex items-center gap-1.5 transition shadow-2xs"
              title={
                language === 'en'
                  ? 'Rediscover a random past letter'
                  : 'Buka 1 surat acak dari masa lalu'
              }
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Random Memory' : 'Kenangan Acak'}</span>
            </button>
          )}
          <span className="px-3.5 py-1.5 rounded-full bg-white/15 text-botanical-100 text-xs font-medium">
            {filtered.length} {language === 'en' ? 'Entries' : 'Catatan'}
          </span>
        </div>
      </div>

      {/* Modern Search & Segmented Filter Pill */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search reflections...' : 'Cari catatanmu...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/90 shadow-ambient border border-white text-xs text-ink-900 focus:outline-none focus:bg-white transition"
          />
        </div>

        <div className="inline-flex p-1 rounded-full bg-[#E6DEC8]/75 border border-white/60 overflow-x-auto no-scrollbar max-w-full shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedFilter === tab.id
                  ? 'bg-botanical-800 text-white shadow-2xs'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Pages List (2 columns on Desktop, 1 on Mobile) */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-xs text-ink-500">
            {language === 'en'
              ? 'No journal pages match this view.'
              : 'Belum ada halaman jurnal di kategori ini.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((entry) => {
            const moodMeta = MOOD_META[entry.mood] || MOOD_META.peaceful;
            const isSealed =
              entry.template === 'capsule' &&
              !entry.isUnlocked &&
              !!entry.unlockDate &&
              entry.unlockDate > nowStr;

            const dateObj = new Date(entry.createdAt);
            const dayNum = String(dateObj.getDate()).padStart(2, '0');
            const monthShort = dateObj.toLocaleDateString(
              language === 'id' ? 'id-ID' : 'en-US',
              { month: 'short' }
            );

            return (
              <div
                key={entry.id}
                onClick={() => onSelectEntry(entry)}
                className="group p-3.5 sm:p-4 rounded-[24px] bg-white/90 hover:bg-white shadow-ambient border border-white hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center gap-3.5"
              >
                {/* Solid Tinted Date Badge */}
                <div className="w-12 h-12 rounded-2xl bg-botanical-100/80 text-botanical-900 shrink-0 flex flex-col items-center justify-center">
                  <div className="font-serif text-lg font-semibold leading-none">
                    {dayNum}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-botanical-700 mt-0.5">
                    {monthShort}
                  </div>
                </div>

                {/* Title & Excerpt */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif font-medium text-base text-ink-900 truncate group-hover:text-botanical-800 transition-colors">
                    {entry.title}
                  </h3>

                  {isSealed ? (
                    <p className="text-xs text-terracotta-600 flex items-center gap-1 mt-0.5">
                      <Lock className="w-3 h-3" />
                      <span>
                        {language === 'en'
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

                {/* Single 3D Emotion Icon */}
                <div className="shrink-0 pl-1">
                  <img
                    src={moodMeta.iconUrl}
                    alt={moodMeta.label[language]}
                    className="w-7 h-7 object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
