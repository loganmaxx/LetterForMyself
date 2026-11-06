import React, { useState, useEffect } from 'react';
import type { Language } from '../../types';
import { AudioEngine, type SoundChannel } from '../../services/audioService';
import {
  Play,
  Square,
  CloudRain,
  Trees,
  Flame,
  Bell,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

interface MindfulPauseViewProps {
  language: Language;
  onCompleteExercise: (points: number) => void;
}

export const MindfulPauseView: React.FC<MindfulPauseViewProps> = ({
  language,
  onCompleteExercise,
}) => {
  const [activeTab, setActiveTab] = useState<'breathe' | 'sound' | 'grounding'>('breathe');

  // Breathwork State
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    if (!isBreathing) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        if (phase === 'inhale') {
          setPhase('hold');
          return 4;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 6;
        } else {
          onCompleteExercise(5);
          setPhase('inhale');
          return 4;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isBreathing, phase, onCompleteExercise]);

  // Sound State
  const [channels, setChannels] = useState<Record<SoundChannel, boolean>>({
    rain: AudioEngine.isChannelActive('rain'),
    forest: AudioEngine.isChannelActive('forest'),
    hearth: AudioEngine.isChannelActive('hearth'),
  });

  // Grounding State
  const [groundingStep, setGroundingStep] = useState(0);

  const groundingStages = [
    {
      count: 5,
      icon: '👀',
      en: 'Look around and name 5 things you can gently see.',
      id: 'Lihat sekelilingmu dan sebutkan 5 benda yang bisa kamu lihat.',
    },
    {
      count: 4,
      icon: '🤲',
      en: 'Notice 4 things you can physically touch or feel.',
      id: 'Rasakan 4 hal yang menyentuh kulit atau tubuhmu saat ini.',
    },
    {
      count: 3,
      icon: '👂',
      en: 'Listen closely to 3 quiet sounds in the room.',
      id: 'Dengarkan 3 suara pelan yang ada di sekitarmu.',
    },
    {
      count: 2,
      icon: '🌿',
      en: 'Notice 2 scents in the air (or recall a calming scent).',
      id: 'Kenali 2 aroma di dekatmu (atau bayangkan aroma yang menenangkan).',
    },
    {
      count: 1,
      icon: '💛',
      en: 'Take 1 slow breath and remind yourself: "I am safe right now."',
      id: 'Tarik 1 napas panjang dan bisikkan: "Saat ini aku aman."',
    },
  ];

  const phaseText = {
    inhale: language === 'en' ? 'Breathe in...' : 'Tarik napas...',
    hold: language === 'en' ? 'Hold gently...' : 'Tahan sebentar...',
    exhale: language === 'en' ? 'Release slowly...' : 'Hembuskan perlahan...',
  }[phase];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-8 space-y-5">
      {/* Solid Botanical Header Banner */}
      <div className="rounded-[26px] bg-botanical-800 text-paper-bg px-6 py-5 shadow-paper flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-botanical-200">
            {language === 'en' ? 'Quiet Sanctuary' : 'Ruang Tenang'}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-paper-bg tracking-tight mt-0.5">
            {language === 'en' ? 'Mindful Pause' : 'Jeda Tenang'}
          </h1>
        </div>
      </div>

      {/* Simple 3-Pill Switcher so only ONE calming tool shows at a time */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-full bg-[#E6DEC8]/80 border border-white/60">
          {[
            { id: 'breathe', label: language === 'en' ? 'Breathe' : 'Napas' },
            { id: 'sound', label: language === 'en' ? 'Nature Sounds' : 'Suara Alam' },
            { id: 'grounding', label: 'Grounding 5-4-3-2-1' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'bg-botanical-800 text-white shadow-xs'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Calm Breathing */}
      {activeTab === 'breathe' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white/80 border border-paper-border text-center space-y-8">
          <div className="space-y-1">
            <h2 className="font-serif text-xl text-ink-900">
              {language === 'en' ? 'Slow Calming Breath (4-4-6)' : 'Napas Penenang (4-4-6)'}
            </h2>
            <p className="text-xs text-ink-500">
              {language === 'en'
                ? 'Follow the circle to soften your shoulders and heart rate'
                : 'Ikuti lingkaran ini untuk merilekskan bahu dan detak jantungmu'}
            </p>
          </div>

          <div className="py-6 flex items-center justify-center">
            <div
              className={`w-44 h-44 rounded-full border flex flex-col items-center justify-center transition-all duration-1000 ${
                !isBreathing
                  ? 'bg-botanical-50/70 border-botanical-200 scale-100'
                  : phase === 'inhale' || phase === 'hold'
                  ? 'bg-botanical-100 border-botanical-400 scale-115'
                  : 'bg-paper-warm border-paper-border scale-90'
              }`}
            >
              <span className="font-serif text-3xl text-ink-800">
                {isBreathing ? secondsLeft : '🌿'}
              </span>
              <span className="text-xs text-ink-600 mt-1">
                {isBreathing
                  ? phaseText
                  : language === 'en'
                  ? 'Tap below to begin'
                  : 'Sentuh tombol di bawah'}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!isBreathing) AudioEngine.playSingingBowl(432);
              setIsBreathing(!isBreathing);
              setPhase('inhale');
              setSecondsLeft(4);
            }}
            className={`px-8 py-3 rounded-full text-xs font-medium inline-flex items-center gap-2 transition ${
              isBreathing
                ? 'bg-paper-warm text-ink-800'
                : 'bg-botanical-600 text-white'
            }`}
          >
            {isBreathing ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>
              {isBreathing
                ? language === 'en'
                  ? 'Pause'
                  : 'Berhenti'
                : language === 'en'
                ? 'Start Breathing'
                : 'Mulai Bernapas'}
            </span>
          </button>
        </div>
      )}

      {/* Tab 2: Simple Ambient Sounds */}
      {activeTab === 'sound' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 border border-paper-border space-y-4">
          <div className="text-center space-y-1 pb-2">
            <h2 className="font-serif text-xl text-ink-900">
              {language === 'en' ? 'Ambient Background' : 'Suara Alam Penenang'}
            </h2>
            <p className="text-xs text-ink-500">
              {language === 'en'
                ? 'Plays gently while you write or rest'
                : 'Tetap mengalun lembut saat kamu menulis jurnal'}
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'rain' as SoundChannel,
                icon: <CloudRain className="w-4 h-4 text-botanical-600" />,
                label: language === 'en' ? 'Gentle Rain' : 'Hujan Rintik',
              },
              {
                id: 'forest' as SoundChannel,
                icon: <Trees className="w-4 h-4 text-botanical-600" />,
                label: language === 'en' ? 'Forest Wind' : 'Angin Hutan',
              },
              {
                id: 'hearth' as SoundChannel,
                icon: <Flame className="w-4 h-4 text-terracotta-600" />,
                label: language === 'en' ? 'Warm Fireplace' : 'Api Hangat',
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  setChannels((prev) => ({
                    ...prev,
                    [item.id]: AudioEngine.toggleChannel(item.id),
                  }))
                }
                className={`w-full p-4 rounded-2xl border flex items-center justify-between text-xs font-medium transition ${
                  channels[item.id]
                    ? 'bg-botanical-50 border-botanical-400 text-botanical-900'
                    : 'bg-paper-bg border-paper-border text-ink-700'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
                <span>{channels[item.id] ? 'ON' : 'OFF'}</span>
              </button>
            ))}

            <button
              onClick={() => AudioEngine.playSingingBowl(432)}
              className="w-full p-4 rounded-2xl bg-amberwarm-50/70 border border-amberwarm-200 text-amberwarm-900 text-xs font-medium flex items-center justify-between"
            >
              <span className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-amberwarm-600" />
                {language === 'en' ? 'Ring Singing Bowl' : 'Bunyikan Lonceng Tenang'}
              </span>
              <span>🔔</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Minimal 5-4-3-2-1 Grounding */}
      {activeTab === 'grounding' && (
        <div className="p-8 rounded-3xl bg-white/80 border border-paper-border text-center space-y-6">
          {groundingStep < groundingStages.length ? (
            <>
              <span className="text-3xl block">{groundingStages[groundingStep].icon}</span>
              <div className="space-y-2 max-w-sm mx-auto">
                <span className="text-xs text-ink-400 uppercase tracking-widest">
                  {groundingStep + 1} / 5
                </span>
                <h2 className="font-serif text-xl text-ink-900 leading-relaxed">
                  {groundingStages[groundingStep][language]}
                </h2>
              </div>
              <button
                onClick={() => {
                  AudioEngine.playSingingBowl(432);
                  setGroundingStep((s) => s + 1);
                }}
                className="px-7 py-2.5 rounded-full bg-botanical-600 text-white text-xs font-medium"
              >
                {language === 'en' ? 'Next →' : 'Lanjut →'}
              </button>
            </>
          ) : (
            <div className="space-y-4 py-4">
              <CheckCircle2 className="w-8 h-8 text-botanical-600 mx-auto" />
              <p className="font-serif text-lg text-ink-900">
                {language === 'en'
                  ? 'You are back in the present moment.'
                  : 'Kamu sudah kembali tenang di saat ini.'}
              </p>
              <button
                onClick={() => setGroundingStep(0)}
                className="px-4 py-2 rounded-full bg-paper-warm text-ink-700 text-xs inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Repeat' : 'Ulangi'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
