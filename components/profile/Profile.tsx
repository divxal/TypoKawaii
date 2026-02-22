import React, { useState } from 'react';
import { Camera, Award } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { ACHIEVEMENTS } from '../../constants/achievements';
import { generateAvatar } from '../../services/geminiService';
import { updateUserInDB } from '../../services/storageService';

const Profile = () => {
  const { themeConfig } = useTheme();
  const { user, setUser } = useUser();
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user) return null;

  const handleGenerateAvatar = async () => {
    setIsGenerating(true);
    const newAvatar = await generateAvatar(user.username);
    if (newAvatar) {
      const updated = { ...user, avatarUrl: newAvatar };
      setUser(updated);
      updateUserInDB(updated);
    } else {
      alert("Error generando el avatar. Inténtalo de nuevo.");
    }
    setIsGenerating(false);
  };

  const userAchievements = user.stats.achievements || [];

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors">
        <div className={`h-32 ${themeConfig.bg} relative`} />
        <div className="px-8 pb-8">
          <div className="relative -top-12 flex justify-between items-end">
            <img src={user.avatarUrl} className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-800 shadow-md bg-white dark:bg-slate-700 object-cover" alt="Avatar" />
            <button
              onClick={handleGenerateAvatar}
              disabled={isGenerating}
              className={`${themeConfig.button} px-6 py-2 rounded-xl font-bold shadow-md flex items-center gap-2`}
            >
              <Camera size={18} /> {isGenerating ? 'Generando...' : 'Crear Avatar AI'}
            </button>
          </div>

          <div className="mt-[-2rem]">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.username}</h1>
            <p className="text-gray-500 dark:text-gray-400">Miembro desde {new Date(user.createdAt || '').toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-blue-500">{user.stats.highestWpm}</div>
              <div className="text-gray-400 dark:text-gray-300 text-sm font-bold uppercase tracking-wide">Mejor WPM</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-purple-500">{user.stats.gamesPlayed}</div>
              <div className="text-gray-400 dark:text-gray-300 text-sm font-bold uppercase tracking-wide">Partidas</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-yellow-500">{user.stats.level}</div>
              <div className="text-gray-400 dark:text-gray-300 text-sm font-bold uppercase tracking-wide">Nivel</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-700 p-6 rounded-2xl text-center">
              <div className="text-3xl font-bold text-orange-500">x{user.stats.highestCombo || 0}</div>
              <div className="text-gray-400 dark:text-gray-300 text-sm font-bold uppercase tracking-wide">Mejor Combo</div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Rangos Actuales</h3>
            <div className="flex gap-4">
              <div className="flex-1 border-2 border-blue-100 dark:border-slate-600 p-4 rounded-xl flex items-center justify-between">
                <span className="dark:text-gray-300">Modo Infinito</span>
                <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full">{user.stats.rankInfinite}</span>
              </div>
              <div className="flex-1 border-2 border-pink-100 dark:border-slate-600 p-4 rounded-xl flex items-center justify-between">
                <span className="dark:text-gray-300">Escritura Libre</span>
                <span className="font-bold text-pink-600 bg-pink-50 dark:bg-pink-900/30 dark:text-pink-300 px-3 py-1 rounded-full">{user.stats.rankFreeWrite}</span>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" /> Logros ({userAchievements.length}/{ACHIEVEMENTS.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {ACHIEVEMENTS.map(achievement => {
                const unlocked = userAchievements.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 transition ${
                      unlocked
                        ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                        : 'bg-gray-50 border-gray-200 opacity-50 dark:bg-slate-700 dark:border-slate-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className={`font-bold text-sm ${unlocked ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-400'}`}>
                      {achievement.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{achievement.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
