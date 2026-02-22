import React from 'react';
import { PenTool, Star, Map, Play, Trophy, Settings, Users, BarChart2, Calendar } from 'lucide-react';
import { GameMode } from '../../types';
import { XP_TABLE, STORY_LEVELS } from '../../constants/levels';
import { TOPICS } from '../../constants/words';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { useGame } from '../../contexts/GameContext';

const Dashboard = () => {
  const { themeConfig } = useTheme();
  const { user } = useUser();
  const { setView, setGameMode, setFreeWriteTopic, setStoryLevel } = useGame();

  if (!user) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const dailyAvailable = user.stats.lastDailyCompleted !== todayStr;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 px-4">
      {/* Modes */}
      <div className="md:col-span-2 space-y-6">
        <h2 className={`text-3xl font-bold ${themeConfig.text} mb-4`}>Selecciona un Modo</h2>

        <div
          onClick={() => { setGameMode(GameMode.Infinite); setView('game'); }}
          className="group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-8 border-blue-400 hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <PenTool className="w-6 h-6 text-blue-400" /> Infinito (Ranked)
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Prueba de resistencia sin fin. Sube de rango.</p>
            </div>
            <Play className="w-10 h-10 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition" />
          </div>
        </div>

        <div
          onClick={() => {
            setGameMode(GameMode.FreeWrite);
            setFreeWriteTopic(TOPICS[Math.floor(Math.random() * TOPICS.length)]);
            setView('game');
          }}
          className="group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-8 border-pink-400 hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Star className="w-6 h-6 text-pink-400" /> Escritura Libre (Ranked)
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Se te da un tema, escribe lo que sientas. Valida vocabulario.</p>
            </div>
            <Play className="w-10 h-10 text-gray-300 dark:text-gray-600 group-hover:text-pink-400 transition" />
          </div>
        </div>

        <div
          onClick={() => { setView('storyMap'); }}
          className="group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-8 border-yellow-400 hover:scale-[1.02]"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Map className="w-6 h-6 text-yellow-400" /> Modo Historia
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Viaja a través de niveles con dificultad progresiva.</p>
            </div>
            <Play className="w-10 h-10 text-gray-300 dark:text-gray-600 group-hover:text-yellow-400 transition" />
          </div>
        </div>

        {/* Daily Challenge */}
        <div
          onClick={() => {
            if (dailyAvailable) {
              setGameMode(GameMode.DailyChallenge);
              const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
              const levelIndex = (dayOfYear % STORY_LEVELS.length) + 1;
              setStoryLevel(levelIndex);
              setView('game');
            }
          }}
          className={`group cursor-pointer bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-8 border-green-400 hover:scale-[1.02] ${!dailyAvailable ? 'opacity-60' : ''}`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-green-500" /> Reto Diario
                {dailyAvailable && <span className="text-xs bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">Disponible</span>}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {dailyAvailable ? "Un nuevo reto te espera cada día. +200 XP bonus." : "¡Ya completaste el reto de hoy! Vuelve mañana."}
              </p>
            </div>
            <Play className="w-10 h-10 text-gray-300 dark:text-gray-600 group-hover:text-green-400 transition" />
          </div>
        </div>
      </div>

      {/* Sidebar Info */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-gray-700 dark:text-white mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Tu Progreso</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm dark:text-gray-300">
              <span>Nivel</span>
              <span className="font-bold">{user.stats.level}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
              <div className={`h-2 rounded-full ${themeConfig.primary}`} style={{ width: `${(user.stats.xp % XP_TABLE.LEVEL_BASE) / 10}%` }} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Rango Infinito</span>
              <span className="font-bold text-blue-500">{user.stats.rankInfinite}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Mejor Combo</span>
              <span className="font-bold text-orange-500">x{user.stats.highestCombo || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Logros</span>
              <span className="font-bold text-purple-500">{(user.stats.achievements || []).length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md">
          <h3 className="font-bold text-gray-700 dark:text-white mb-4 flex items-center gap-2"><Settings className="w-5 h-5" /> Accesos Rápidos</h3>
          <button onClick={() => setView('friends')} className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 transition dark:text-gray-300">
            <Users className="w-5 h-5 text-gray-400" /> Amigos
          </button>
          <button onClick={() => setView('leaderboard')} className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3 transition dark:text-gray-300">
            <BarChart2 className="w-5 h-5 text-gray-400" /> Leaderboard Global
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
