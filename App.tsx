import React from 'react';
import { useTheme } from './contexts/ThemeContext';
import { useUser } from './contexts/UserContext';
import { useGame } from './contexts/GameContext';
import AuthScreen from './components/auth/AuthScreen';
import Navbar from './components/layout/Navbar';
import FloatingControls from './components/layout/FloatingControls';
import Dashboard from './components/dashboard/Dashboard';
import GameScreen from './components/game/GameScreen';
import StoryMap from './components/story/StoryMap';
import Profile from './components/profile/Profile';
import Leaderboard from './components/social/Leaderboard';
import Friends from './components/social/Friends';
import AtlasChat from './components/chat/AtlasChat';

const App = () => {
  const { user } = useUser();
  const { view } = useGame();
  const { themeConfig } = useTheme();

  if (!user) return <AuthScreen />;

  return (
    <div className={`min-h-screen ${themeConfig.bg} font-sans pb-20 transition-colors duration-500`}>
      <Navbar />
      <main className="animate-fade-in">
        {view === 'dashboard' && <Dashboard />}
        {view === 'game' && <GameScreen />}
        {view === 'storyMap' && <StoryMap />}
        {view === 'profile' && <Profile />}
        {view === 'leaderboard' && <Leaderboard />}
        {view === 'friends' && <Friends />}
      </main>
      <FloatingControls />
      <AtlasChat />
    </div>
  );
};

export default App;
