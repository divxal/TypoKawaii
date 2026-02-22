import React from 'react';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import { Theme } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useSound } from '../../hooks/useSound';

const FloatingControls = () => {
  const { theme, setTheme, darkMode, toggleDarkMode } = useTheme();
  const { muted, toggleMute } = useSound();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-30">
      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300"
        title={muted ? 'Activar sonido' : 'Silenciar'}
      >
        {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 text-gray-600 dark:text-yellow-400"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Theme Switcher */}
      <div className="flex gap-2 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700">
        <button onClick={() => setTheme(Theme.Cinnamoroll)} className={`w-8 h-8 rounded-full bg-sky-300 hover:bg-sky-400 border-2 ${theme === Theme.Cinnamoroll ? 'border-sky-600 scale-110' : 'border-transparent'} transition`} />
        <button onClick={() => setTheme(Theme.Kuromi)} className={`w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 border-2 ${theme === Theme.Kuromi ? 'border-purple-800 scale-110' : 'border-transparent'} transition`} />
        <button onClick={() => setTheme(Theme.MyMelody)} className={`w-8 h-8 rounded-full bg-pink-400 hover:bg-pink-500 border-2 ${theme === Theme.MyMelody ? 'border-pink-700 scale-110' : 'border-transparent'} transition`} />
        <button onClick={() => setTheme(Theme.Pompompurin)} className={`w-8 h-8 rounded-full bg-yellow-400 hover:bg-yellow-500 border-2 ${theme === Theme.Pompompurin ? 'border-yellow-700 scale-110' : 'border-transparent'} transition`} />
      </div>
    </div>
  );
};

export default FloatingControls;
