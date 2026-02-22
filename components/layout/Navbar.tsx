import React from 'react';
import { Heart, Users, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { useGame } from '../../contexts/GameContext';

const Navbar = () => {
  const { themeConfig } = useTheme();
  const { user, handleLogout } = useUser();
  const { setView } = useGame();

  if (!user) return null;

  return (
    <nav className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 dark:border-slate-700 px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className={`w-8 h-8 rounded-lg ${themeConfig.primary} flex items-center justify-center`}>
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <span className={`text-xl font-bold ${themeConfig.text}`}>TypoKawaii</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => setView('friends')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition relative">
            <Users className="w-6 h-6 text-gray-500 dark:text-gray-300" />
          </button>
          <button onClick={() => setView('profile')} className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full transition">
            <img src={user.avatarUrl} className="w-8 h-8 rounded-full bg-white object-cover" alt="Profile" />
            <span className="font-bold text-sm text-gray-700 dark:text-white">{user.username}</span>
          </button>
          <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
