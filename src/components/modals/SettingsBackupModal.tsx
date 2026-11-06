import React, { useState } from 'react';
import type { FontStyle, Language, PaperTheme, UserSettings } from '../../types';
import { PAPER_THEMES } from '../../data/bilingualData';
import { StorageService } from '../../services/storageService';
import {
  X,
  Settings,
  Download,
  Upload,
  Lock,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface SettingsBackupModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onClose: () => void;
  onUpdateSettings: (updated: UserSettings) => void;
  onDataRestored: () => void;
}

export const SettingsBackupModal: React.FC<SettingsBackupModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onDataRestored,
}) => {
  const [language, setLanguage] = useState<Language>(settings.language);
  const lang = language;
  const [name, setName] = useState(settings.name);
  const [defaultPaper, setDefaultPaper] = useState<PaperTheme>(settings.defaultPaper);
  const [defaultFont, setDefaultFont] = useState<FontStyle>(settings.defaultFont);
  const [pinEnabled, setPinEnabled] = useState(settings.pinEnabled);
  const [pinCode, setPinCode] = useState(settings.pinCode || '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleLanguageChange = (nextLang: Language) => {
    setLanguage(nextLang);
    onUpdateSettings({
      ...settings,
      language: nextLang,
    });
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      language,
      name: name.trim() || 'Traveler',
      defaultPaper,
      defaultFont,
      pinEnabled: pinEnabled && pinCode.length === 4,
      pinCode: pinCode.length === 4 ? pinCode : '',
    });
    setStatusMessage(
      lang === 'en' ? 'Preferences saved!' : 'Pengaturan berhasil disimpan!'
    );
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleExportJson = () => {
    const data = StorageService.exportAll();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `letterformyself-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = StorageService.importAll(String(reader.result));
      if (ok) {
        onDataRestored();
        setStatusMessage(
          lang === 'en'
            ? 'Backup restored successfully!'
            : 'Cadangan jurnal berhasil dipulihkan!'
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl sm:my-auto rounded-t-3xl sm:rounded-3xl bg-paper-bg border border-paper-border shadow-paper-lg p-5 sm:p-8 space-y-5 max-h-[92dvh] overflow-y-auto pb-safe">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-paper-warm text-ink-600 hover:bg-paper-deep"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-botanical-100 text-botanical-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-2xl text-ink-900">
              {lang === 'en'
                ? 'Notebook Preferences & Privacy'
                : 'Pengaturan Jurnal & Privasi'}
            </h2>
            <p className="text-xs text-ink-600">
              {lang === 'en'
                ? '100% local-first—your journals stay privately on your device.'
                : '100% tersimpan lokal di perangkatmu demi privasi penuh.'}
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 rounded-2xl bg-botanical-100 border border-botanical-300 text-botanical-900 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-botanical-700" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSavePreferences} className="space-y-4">
          {/* App Language Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink-600 block mb-1.5">
              {lang === 'en' ? 'App Language' : 'Bahasa Aplikasi'}
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-paper-warm border border-paper-border">
              <button
                type="button"
                onClick={() => handleLanguageChange('id')}
                className={`py-2 rounded-xl text-xs font-semibold transition ${
                  language === 'id'
                    ? 'bg-botanical-800 text-white shadow-2xs'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                Bahasa Indonesia
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`py-2 rounded-xl text-xs font-semibold transition ${
                  language === 'en'
                    ? 'bg-botanical-800 text-white shadow-2xs'
                    : 'text-ink-600 hover:text-ink-900'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-ink-600 block mb-1">
              {lang === 'en' ? 'Your Name / Nickname' : 'Nama Panggilanmu'}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-paper-border text-sm text-ink-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-600 block mb-1">
                {lang === 'en' ? 'Default Paper Texture' : 'Kertas Default'}
              </label>
              <select
                value={defaultPaper}
                onChange={(e) => setDefaultPaper(e.target.value as PaperTheme)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-paper-border text-xs text-ink-900"
              >
                {PAPER_THEMES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name[lang]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-600 block mb-1">
                {lang === 'en' ? 'Default Typography' : 'Huruf Default'}
              </label>
              <select
                value={defaultFont}
                onChange={(e) => setDefaultFont(e.target.value as FontStyle)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-paper-border text-xs text-ink-900"
              >
                <option value="serif">Editorial Serif (Newsreader)</option>
                <option value="sans">Clean Sans (Plus Jakarta)</option>
                <option value="handwriting">Handwritten Ink (Caveat)</option>
              </select>
            </div>
          </div>

          {/* PIN Lock */}
          <div className="p-4 rounded-2xl bg-paper-warm border border-paper-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-botanical-700" />
                {lang === 'en' ? '4-Digit Privacy PIN Lock' : 'Kunci PIN Privasi 4 Digit'}
              </span>
              <input
                type="checkbox"
                checked={pinEnabled}
                onChange={(e) => setPinEnabled(e.target.checked)}
                className="accent-botanical-600 w-4 h-4"
              />
            </div>
            {pinEnabled && (
              <input
                type="password"
                maxLength={4}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                placeholder={lang === 'en' ? 'Enter 4-digit PIN (e.g. 1234)' : 'Masukkan 4 angka PIN'}
                className="w-full px-3 py-2 rounded-xl bg-white border border-paper-border text-xs tracking-widest font-mono"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-botanical-600 hover:bg-botanical-700 text-white text-xs font-semibold transition"
          >
            {lang === 'en' ? 'Save Preferences' : 'Simpan Pengaturan'}
          </button>
        </form>

        {/* Backup & Restore */}
        <div className="pt-4 border-t border-paper-border space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-600 block">
            {lang === 'en' ? 'Backup & Data Sanctuary' : 'Cadangan & Pemulihan Data'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-2.5 rounded-xl bg-white border border-paper-border text-ink-800 hover:bg-paper-warm text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-botanical-600" />
              <span>{lang === 'en' ? 'Export JSON' : 'Ekspor JSON'}</span>
            </button>

            <label className="px-3 py-2.5 rounded-xl bg-white border border-paper-border text-ink-800 hover:bg-paper-warm text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-botanical-600" />
              <span>{lang === 'en' ? 'Import JSON' : 'Impor JSON'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-3 py-2.5 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta-800 hover:bg-terracotta-100 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Reset Demo' : 'Reset Contoh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Reset Demo Confirmation Popup Modal */}
      {confirmReset && (
        <div
          className="fixed inset-0 z-[60] bg-ink-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setConfirmReset(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-paper-bg border border-paper-border p-6 shadow-2xl space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-lg font-medium text-ink-900">
                {lang === 'en'
                  ? 'Reset to demo data?'
                  : 'Reset ke data contoh awal?'}
              </h3>
              <p className="text-xs text-ink-500 leading-relaxed">
                {lang === 'en'
                  ? 'Your current letters and mood logs will be replaced with the starter sample entries.'
                  : 'Semua catatan surat dan riwayat mood saat ini akan diganti kembali ke contoh awal.'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="py-2.5 px-4 rounded-xl bg-paper-warm hover:bg-paper-deep text-ink-700 text-xs font-semibold transition"
              >
                {lang === 'en' ? 'Cancel' : 'Batal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  StorageService.resetToDemo();
                  onDataRestored();
                  setConfirmReset(false);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-semibold shadow-sm transition"
              >
                {lang === 'en' ? 'Yes, Reset' : 'Ya, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
