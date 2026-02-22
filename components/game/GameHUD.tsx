import React from 'react';
import { Clock, Zap, Target, Flame } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { GameMode } from '../../types';

interface GameHUDProps {
  timeLeft: number;
  isUrgent: boolean;
  isCritical: boolean;
  wpm: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  gameMode: GameMode;
  title: string;
  progress?: number;
}

const GameHUD = ({ timeLeft, isUrgent, isCritical, wpm, accuracy, combo, maxCombo, gameMode, title, progress }: GameHUDProps) => {
  const { themeConfig } = useTheme();

  const timerClass = isCritical
    ? 'text-red-500 animate-pulse scale-110'
    : isUrgent
      ? 'text-orange-500 animate-pulse'
      : 'dark:text-white';

  return (
    <div className="mb-6">
      {/* Top row: Timer, Title, Stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock className={isUrgent ? 'text-red-500' : themeConfig.accent} />
          <span className={`text-3xl font-bold font-mono transition-all ${timerClass}`}>{timeLeft}s</span>
        </div>
        <div className={`text-lg font-bold ${themeConfig.text}`}>{title}</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-sm dark:text-white">{wpm} <span className="text-gray-400 text-xs">WPM</span></span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-sm dark:text-white">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Combo display */}
      {combo > 1 && (
        <div className="flex justify-center mb-3">
          <div className={`
            flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-sm
            transition-all duration-200
            ${combo >= 20 ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300 scale-110' :
              combo >= 10 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300 scale-105' :
              combo >= 5 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300' :
              'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300'}
          `}>
            <Flame className={`w-4 h-4 ${combo >= 10 ? 'animate-bounce' : ''}`} />
            <span>x{combo} Combo</span>
            {combo >= 5 && <span className="text-xs opacity-60">(x{combo >= 20 ? '5' : combo >= 10 ? '3' : '2'} XP)</span>}
          </div>
        </div>
      )}

      {/* Progress bar for story mode */}
      {progress !== undefined && (
        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5 mb-2">
          <div
            className={`h-2.5 rounded-full ${themeConfig.primary} transition-all duration-300`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
          <div className="text-right text-xs text-gray-400 mt-1">{Math.round(progress)}%</div>
        </div>
      )}
    </div>
  );
};

export default GameHUD;
