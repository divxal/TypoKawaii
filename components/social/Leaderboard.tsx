import React, { useState, useMemo } from 'react';
import { MOCK_LEADERBOARD } from '../../constants/levels';
import { useTheme } from '../../contexts/ThemeContext';

const Leaderboard = () => {
  const { themeConfig } = useTheme();
  const [filter, setFilter] = useState<'today' | 'week' | 'all'>('all');

  const displayedData = useMemo(() => {
    return MOCK_LEADERBOARD.map(u => ({
      ...u,
      wpm: filter === 'today' ? u.wpm - Math.floor(Math.random() * 20) : filter === 'week' ? u.wpm - Math.floor(Math.random() * 10) : u.wpm
    })).sort((a, b) => b.wpm - a.wpm);
  }, [filter]);

  return (
    <div className="max-w-4xl mx-auto pt-10 px-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl transition-colors">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-3xl font-bold ${themeConfig.text}`}>Clasificación Mundial</h2>
          <div className="flex gap-2">
            {(['today', 'week', 'all'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1 rounded-full font-bold transition ${filter === f ? themeConfig.primary + ' text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
              >
                {f === 'today' ? 'Hoy' : f === 'week' ? 'Semanal' : 'Histórico'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {displayedData.map((u, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition">
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-600' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'}`}>
                  {i + 1}
                </div>
                <img src={u.avatar} className="w-10 h-10 rounded-full bg-gray-100" alt={u.name} />
                <span className="font-bold text-gray-700 dark:text-white">{u.name}</span>
              </div>
              <div className="flex gap-8 text-right">
                <div>
                  <span className="block font-bold text-gray-800 dark:text-gray-200">{u.wpm} WPM</span>
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${i === 0 ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                    {u.rank}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
