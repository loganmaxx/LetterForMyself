import React from 'react';
import type { Language, MainView } from '../../types';
import { Home, BookOpen, Plus, CalendarHeart, Wind } from 'lucide-react';

interface BottomNavDockProps {
  currentView: MainView;
  language: Language;
  journalCount: number;
  onSelectView: (view: MainView) => void;
  onOpenWriteStudio: () => void;
}

export const BottomNavDock: React.FC<BottomNavDockProps> = ({
  currentView,
  language,
  onSelectView,
  onOpenWriteStudio,
}) => {
  const navItems: { id: MainView; icon: React.ReactNode; label: string }[] = [
    {
      id: 'home',
      icon: <Home className="w-4 h-4" />,
      label: language === 'en' ? 'Home' : 'Beranda',
    },
    {
      id: 'notebook',
      icon: <BookOpen className="w-4 h-4" />,
      label: language === 'en' ? 'Journal' : 'Jurnal',
    },
    {
      id: 'insights',
      icon: <CalendarHeart className="w-4 h-4" />,
      label: language === 'en' ? 'History' : 'Riwayat',
    },
    {
      id: 'sanctuary',
      icon: <Wind className="w-4 h-4" />,
      label: language === 'en' ? 'Calm' : 'Tenang',
    },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-30 flex justify-center px-4 pointer-events-none pb-safe">
      <nav className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-botanical-900/95 backdrop-blur-2xl shadow-float border border-white/10">
        {/* Left 2 Tabs */}
        {navItems.slice(0, 2).map((item) => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`px-3.5 py-2 rounded-full flex items-center gap-1.5 text-xs transition-all duration-200 active:scale-95 ${
                active
                  ? 'bg-botanical-700 text-paper-bg font-semibold shadow-2xs'
                  : 'text-botanical-200/75 hover:text-paper-bg'
              }`}
            >
              {item.icon}
              <span className={active ? 'inline' : 'hidden sm:inline'}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Center Floating Write Pill */}
        <button
          onClick={onOpenWriteStudio}
          className={`mx-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shadow-md ${
            currentView === 'write'
              ? 'bg-terracotta-600 text-white rotate-45'
              : 'bg-terracotta-500 hover:bg-terracotta-400 text-white hover:scale-105'
          }`}
          title={language === 'en' ? 'New Entry' : 'Tulis Baru'}
        >
          <Plus className="w-5 h-5 stroke-[2.4]" />
        </button>

        {/* Right 2 Tabs */}
        {navItems.slice(2).map((item) => {
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`px-3.5 py-2 rounded-full flex items-center gap-1.5 text-xs transition-all duration-200 active:scale-95 ${
                active
                  ? 'bg-botanical-700 text-paper-bg font-semibold shadow-2xs'
                  : 'text-botanical-200/75 hover:text-paper-bg'
              }`}
            >
              {item.icon}
              <span className={active ? 'inline' : 'hidden sm:inline'}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
