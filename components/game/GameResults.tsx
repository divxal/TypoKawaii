import React, { useEffect, useState } from 'react';
import { Trophy, ArrowRight, Award } from 'lucide-react';
import { GameMode, GameResult } from '../../types';
import { STORY_LEVELS } from '../../constants/levels';
import { ACHIEVEMENTS } from '../../constants/achievements';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { useGame } from '../../contexts/GameContext';

interface GameResultsProps {
  stats: GameResult;
  newAchievements: string[];
  onRetry: () => void;
}

const Confetti = () => {
  const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6fff', '#845ef7'];
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: `${p.left}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const GameResults = ({ stats, newAchievements, onRetry }: GameResultsProps) => {
  const { themeConfig } = useTheme();
  const { user } = useUser();
  const { gameMode, storyLevel, setStoryLevel, setView } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (stats.isWin) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [stats.isWin]);

  const isStoryWin = gameMode === GameMode.Story && stats.isWin;

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="flex flex-col items-center justify-center h-full animate-fade-in py-10">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-4 border-dashed border-gray-200 dark:border-slate-700 text-center max-w-lg w-full">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${themeConfig.text}`} />
          <h2 className="text-3xl font-bold mb-2 dark:text-white">
            {gameMode === GameMode.Story || gameMode === GameMode.DailyChallenge
              ? (stats.isWin ? "¡Nivel Completado!" : "Inténtalo de nuevo")
              : "¡Sesión Terminada!"}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6 mt-6">
            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-gray-500 dark:text-gray-300 text-sm">WPM</p>
              <p className="text-3xl font-bold text-green-500">{stats.wpm}</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-gray-500 dark:text-gray-300 text-sm">Precisión</p>
              <p className="text-3xl font-bold text-blue-500">{stats.accuracy}%</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-gray-500 dark:text-gray-300 text-sm">XP Ganada</p>
              <p className="text-3xl font-bold text-purple-500">+{stats.xpEarned}</p>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
              <p className="text-gray-500 dark:text-gray-300 text-sm">Combo Máximo</p>
              <p className="text-3xl font-bold text-orange-500">x{stats.maxCombo}</p>
            </div>
          </div>

          {/* New achievements */}
          {newAchievements.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-center gap-2 justify-center mb-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-700 dark:text-yellow-300">¡Nuevos Logros!</span>
              </div>
              <div className="space-y-1">
                {newAchievements.map(id => {
                  const achievement = ACHIEVEMENTS.find(a => a.id === id);
                  if (!achievement) return null;
                  return (
                    <div key={id} className="text-sm text-yellow-600 dark:text-yellow-300">
                      {achievement.icon} {achievement.name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {isStoryWin && storyLevel < STORY_LEVELS.length && (
              <button
                onClick={() => {
                  setStoryLevel(storyLevel + 1);
                  onRetry();
                }}
                className={`w-full ${themeConfig.button} py-3 rounded-xl font-bold transition flex justify-center items-center gap-2`}
              >
                Siguiente Nivel <ArrowRight size={20} />
              </button>
            )}

            <div className="flex gap-4">
              <button onClick={() => setView('dashboard')} className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white text-gray-700 py-3 rounded-xl font-bold transition">Menú</button>
              <button
                onClick={onRetry}
                className={`flex-1 ${themeConfig.button} py-3 rounded-xl font-bold transition`}
              >
                Repetir
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameResults;
