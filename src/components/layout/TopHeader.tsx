import React, { useState } from 'react';
import type { Language, UserSettings } from '../../types';
import { AudioEngine, type SoundChannel } from '../../services/audioService';
import {
  Feather,
  Volume2,
  Settings,
  Lock,
  CloudRain,
  Trees,
  Flame,
  Bell,
  Moon,
  Sun,
} from 'lucide-react';

interface TopHeaderProps {
  settings: UserSettings;
  onToggleLanguage: (lang: Language) => void;
  onToggleNightMode: () => void;
  onOpenSettings: () => void;
  onLockNow: () => void;
  onGoHome: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  settings,
  onToggleNightMode,
  onOpenSettings,
  onLockNow,
  onGoHome,
}) => {
  const lang = settings.language;

  const [soundDrawerOpen, setSoundDrawerOpen] = useState(false);
  const [activeChannels, setActiveChannels] = useState<Record<SoundChannel, boolean>>({
    rain: AudioEngine.isChannelActive('rain'),
    forest: AudioEngine.isChannelActive('forest'),
    hearth: AudioEngine.isChannelActive('hearth'),
  });

  const handleToggleSound = (ch: SoundChannel) => {
    const nextState = AudioEngine.toggleChannel(ch);
    setActiveChannels((prev) => ({ ...prev, [ch]: nextState }));
  };

  const anyPlaying = activeChannels.rain || activeChannels.forest || activeChannels.hearth;

  return (
    <header className="sticky top-0 z-30 w-full bg-paper-bg/85 backdrop-blur-xl border-b border-ink-900/5 pt-safe">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Modern Editorial Brand */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          <div className="w-8 h-8 rounded-[11px] bg-[#2D5A47] text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
            <Feather className="w-4 h-4" />
          </div>
          <span className="font-serif text-lg text-ink-900 tracking-tight font-medium">
            Letter<span className="italic font-normal text-ink-500">ForMyself</span>
          </span>
        </button>

        {/* Minimal Quiet Controls */}
        <div className="flex items-center gap-1">
          {/* Cozy Night Mode Toggle */}
          <button
            onClick={onToggleNightMode}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
              settings.nightMode
                ? 'text-amberwarm-300 bg-white/10 hover:bg-white/15'
                : 'text-ink-400 hover:text-ink-900 hover:bg-black/5'
            }`}
            title={
              settings.nightMode
                ? lang === 'en'
                  ? 'Switch to Daylight Mode'
                  : 'Mode Siang'
                : lang === 'en'
                ? 'Cozy Night Mode'
                : 'Mode Malam Tenang'
            }
          >
            {settings.nightMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Ambient Sound Icon */}
          <div className="relative">
            <button
              onClick={() => setSoundDrawerOpen(!soundDrawerOpen)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                anyPlaying
                  ? 'text-botanical-700 bg-botanical-100/90'
                  : 'text-ink-400 hover:text-ink-900 hover:bg-black/5'
              }`}
              title={lang === 'en' ? 'Ambient Sounds' : 'Suara Alam'}
            >
              <Volume2 className={`w-4 h-4 ${anyPlaying ? 'animate-pulse' : ''}`} />
            </button>

            {soundDrawerOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setSoundDrawerOpen(false)}
                />
                <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-14 sm:top-auto sm:mt-2 sm:w-64 rounded-[24px] bg-white/95 backdrop-blur-xl p-4 shadow-float border border-white z-50 space-y-1.5 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between px-1 pb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-400">
                      {lang === 'en' ? 'Soundscape' : 'Suara Alam'}
                    </span>
                    {anyPlaying && (
                      <button
                        onClick={() => {
                          AudioEngine.stopAll();
                          setActiveChannels({ rain: false, forest: false, hearth: false });
                        }}
                        className="text-[11px] text-terracotta-600 font-medium"
                      >
                        {lang === 'en' ? 'Stop' : 'Matikan'}
                      </button>
                    )}
                  </div>

                  {[
                    {
                      id: 'rain' as SoundChannel,
                      icon: <CloudRain className="w-4 h-4" />,
                      label: lang === 'en' ? 'Gentle Rain' : 'Hujan Rintik',
                    },
                    {
                      id: 'forest' as SoundChannel,
                      icon: <Trees className="w-4 h-4" />,
                      label: lang === 'en' ? 'Forest Wind' : 'Angin Hutan',
                    },
                    {
                      id: 'hearth' as SoundChannel,
                      icon: <Flame className="w-4 h-4" />,
                      label: lang === 'en' ? 'Warm Hearth' : 'Api Hangat',
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleToggleSound(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition ${
                        activeChannels[item.id]
                          ? 'bg-botanical-50 text-botanical-800 font-semibold'
                          : 'text-ink-700 hover:bg-paper-bg'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        {item.icon}
                        {item.label}
                      </span>
                      {activeChannels[item.id] && (
                        <span className="w-2 h-2 rounded-full bg-botanical-600" />
                      )}
                    </button>
                  ))}

                  <button
                    onClick={() => AudioEngine.playSingingBowl(432)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs text-ink-600 hover:bg-paper-bg transition"
                  >
                    <Bell className="w-4 h-4 text-amberwarm-600" />
                    <span>{lang === 'en' ? 'Singing Bowl Chime' : 'Lonceng Tenang'}</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Lock if PIN is enabled */}
          {settings.pinEnabled && settings.pinCode && (
            <button
              onClick={onLockNow}
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink-400 hover:text-ink-900 hover:bg-black/5 transition"
              title="Lock"
            >
              <Lock className="w-4 h-4" />
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ink-400 hover:text-ink-900 hover:bg-black/5 transition"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
