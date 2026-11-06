import React, { useState, useEffect, useCallback } from 'react';
import type { Language } from '../../types';
import { Lock, Feather } from 'lucide-react';

interface PinLockModalProps {
  expectedPin: string;
  language: Language;
  onUnlock: () => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  expectedPin,
  language,
  onUnlock,
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = useCallback(
    (d: string) => {
      setInput((prev) => {
        if (prev.length >= 4) return prev;
        const next = prev + d;
        setError(false);
        if (next.length === 4) {
          if (next === expectedPin) {
            setTimeout(() => onUnlock(), 50);
          } else {
            setError(true);
            setTimeout(() => setInput(''), 400);
          }
        }
        return next;
      });
    },
    [expectedPin, onUnlock]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setError(false);
        setInput((s) => s.slice(0, -1));
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        e.preventDefault();
        setError(false);
        setInput('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit]);

  return (
    <div className="min-h-screen w-full bg-paper-bg paper-botanical flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl botanical-card p-8 text-center space-y-6 shadow-paper-lg">
        <div className="w-14 h-14 rounded-2xl bg-botanical-600 text-white flex items-center justify-center mx-auto shadow-md">
          <Feather className="w-7 h-7" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-botanical-700">
            <Lock className="w-3.5 h-3.5" />
            {language === 'en' ? 'Private Sanctuary' : 'Sanctuary Pribadi'}
          </span>
          <h1 className="font-serif font-bold text-2xl text-ink-900 mt-1">
            LetterForMyself
          </h1>
          <p className="text-xs text-ink-600 mt-1">
            {language === 'en'
              ? 'Enter your 4-digit PIN to open your notebook'
              : 'Masukkan 4 digit PIN untuk membuka buku jurnalmu'}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 py-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition ${
                error
                  ? 'bg-rose-500 border-rose-600'
                  : input.length > idx
                  ? 'bg-botanical-600 border-botanical-700 scale-110'
                  : 'bg-paper-warm border-ink-400'
              }`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(
            (key) => (
              <button
                key={key}
                onClick={() => {
                  if (key === 'C') setInput('');
                  else if (key === '⌫') setInput((s) => s.slice(0, -1));
                  else handleDigit(key);
                }}
                className="h-12 rounded-2xl bg-white hover:bg-paper-warm border border-paper-border font-serif font-bold text-lg text-ink-900 active:scale-95 transition"
              >
                {key}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
