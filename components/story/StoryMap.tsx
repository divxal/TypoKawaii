import React from 'react';
import { Lock, CheckCircle, Play } from 'lucide-react';
import { GameMode } from '../../types';
import { STORY_LEVELS } from '../../constants/levels';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { useGame } from '../../contexts/GameContext';

const StoryMap = () => {
  const { themeConfig } = useTheme();
  const { user } = useUser();
  const { setView, setStoryLevel, setGameMode } = useGame();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4 animate-fade-in">
      <h2 className={`text-4xl font-bold text-center mb-10 ${themeConfig.text}`}>Mapa de Aventura</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        <div className="absolute left-1/2 top-10 bottom-10 w-1 bg-gray-200 dark:bg-gray-700 hidden md:block transform -translate-x-1/2 -z-10" />

        {STORY_LEVELS.map((level, index) => {
          const isLocked = level.id > user.stats.storyProgress;
          const isCompleted = level.id < user.stats.storyProgress;

          return (
            <div
              key={level.id}
              className={`relative group ${index % 2 === 0 ? 'md:text-right md:pr-10' : 'md:text-left md:pl-10 md:col-start-2'}`}
            >
              <button
                onClick={() => {
                  if (!isLocked) {
                    setStoryLevel(level.id);
                    setGameMode(GameMode.Story);
                    setView('game');
                  }
                }}
                disabled={isLocked}
                className={`
                  w-full p-6 rounded-2xl shadow-lg border-4 transition-all transform hover:scale-105
                  ${isLocked
                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700'
                    : isCompleted
                      ? 'bg-green-50 border-green-200 hover:border-green-400 cursor-pointer dark:bg-green-900/20 dark:border-green-800'
                      : `bg-white ${themeConfig.border} cursor-pointer hover:shadow-2xl dark:bg-slate-800 dark:text-white`
                  }
                `}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className={`${index % 2 !== 0 ? 'order-2' : ''}`}>
                    <span className={`text-sm font-bold uppercase tracking-wide ${isLocked ? 'text-gray-400' : themeConfig.accent}`}>Nivel {level.id}</span>
                    <h3 className="text-xl font-bold">{level.name}</h3>
                    <div className="text-xs mt-2 text-gray-500 flex gap-2 justify-end">
                      <span>Min WPM: {level.minWpm}</span>
                      <span>Precisión: {level.minAccuracy}%</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLocked ? 'bg-gray-200' : isCompleted ? 'bg-green-100 text-green-600' : themeConfig.primary + ' text-white'}`}>
                    {isLocked ? <Lock size={20} /> : isCompleted ? <CheckCircle size={20} /> : <Play size={20} fill="currentColor" />}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <button onClick={() => setView('dashboard')} className="mt-10 mx-auto block text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white underline">
        Volver al Dashboard
      </button>
    </div>
  );
};

export default StoryMap;
