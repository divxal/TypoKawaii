import React from 'react';
import { Search, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Friends = () => {
  const { themeConfig } = useTheme();

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl transition-colors">
        <h2 className={`text-3xl font-bold ${themeConfig.text} mb-6`}>Amigos</h2>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Buscar jugador por ID..." className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 dark:text-white rounded-xl border border-gray-200 dark:border-slate-600 outline-none focus:border-blue-400" />
        </div>

        <div className="space-y-4">
          <div className="text-center py-10 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aún no has añadido amigos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends;
