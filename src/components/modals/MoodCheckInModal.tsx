import React, { useState } from 'react';
import type { Language, MoodCheckIn, MoodType } from '../../types';
import { MOOD_META } from '../../data/bilingualData';
import { AudioEngine } from '../../services/audioService';
import { X, Check } from 'lucide-react';

interface MoodCheckInModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onSave: (data: Omit<MoodCheckIn, 'id' | 'timestamp'>) => void;
}

export const MoodCheckInModal: React.FC<MoodCheckInModalProps> = ({
  isOpen,
  language,
  onClose,
  onSave,
}) => {
  const [mood, setMood] = useState<MoodType>('peaceful');
  const [moodCategoryFilter, setMoodCategoryFilter] = useState<
    'all' | 'warm' | 'calm' | 'tender'
  >('all');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const allMoodKeys = (Object.keys(MOOD_META) as MoodType[]).filter((k) =>
    moodCategoryFilter === 'all' ? true : MOOD_META[k].category === moodCategoryFilter
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    AudioEngine.playSingingBowl(432);
    onSave({
      mood,
      emotions: [],
      bodySensations: [],
      energyLevel: 4,
      sleepQuality: 4,
      note: note.trim(),
    });
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/45 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-paper-bg border border-white shadow-paper-lg p-5 sm:p-6 space-y-4 max-h-[90dvh] overflow-y-auto pb-safe">
        {/* Header + Filter Pills */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-serif font-medium text-xl text-ink-900">
              {language === 'en' ? 'How are you feeling?' : 'Apa yang kamu rasakan?'}
            </h2>
            <p className="text-xs text-ink-500">
              {MOOD_META[mood].subtitle[language]}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-paper-warm text-ink-600 hover:bg-paper-deep transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Filter Pill */}
          <div className="inline-flex p-1 rounded-full bg-[#E6DEC8]/80 border border-white/60 text-xs">
            {[
              { id: 'all', label: language === 'en' ? 'All' : 'Semua' },
              { id: 'warm', label: language === 'en' ? 'Warm' : 'Hangat' },
              { id: 'calm', label: language === 'en' ? 'Calm' : 'Tenang' },
              { id: 'tender', label: language === 'en' ? 'Heavy' : 'Berat' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setMoodCategoryFilter(cat.id as any)}
                className={`px-3 py-1 rounded-full font-medium transition ${
                  moodCategoryFilter === cat.id
                    ? 'bg-botanical-800 text-white shadow-2xs'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Clean 5-Column 3D Emotion Grid (No nested scrollbars!) */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {allMoodKeys.map((mKey) => {
              const m = MOOD_META[mKey];
              const active = mood === mKey;
              return (
                <button
                  key={mKey}
                  type="button"
                  onClick={() => setMood(mKey)}
                  className={`py-2.5 px-1.5 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                    active
                      ? 'bg-botanical-800 text-white border-botanical-800 shadow-sm scale-[1.03]'
                      : 'bg-white/90 text-ink-800 border-white hover:bg-white'
                  }`}
                >
                  <img
                    src={m.iconUrl}
                    alt={m.label[language]}
                    className="w-8 h-8 object-contain shrink-0"
                  />
                  <span className="font-medium text-[11px] truncate w-full">
                    {m.label[language]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Optional 1-Line Note + Save Button */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Add a short note (optional)...'
                  : 'Tulis catatan singkat (opsional)...'
              }
              className="flex-1 px-4 py-2.5 rounded-full bg-white border border-white shadow-ambient text-xs text-ink-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-botanical-800 hover:bg-botanical-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shrink-0 transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Save' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
