import React, { createContext, useContext, useState } from 'react';
import { GameMode, ViewType } from '../types';

interface GameContextType {
  view: ViewType;
  setView: (view: ViewType) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  storyLevel: number;
  setStoryLevel: (level: number) => void;
  freeWriteTopic: string;
  setFreeWriteTopic: (topic: string) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [view, setView] = useState<ViewType>('dashboard');
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.Infinite);
  const [storyLevel, setStoryLevel] = useState<number>(1);
  const [freeWriteTopic, setFreeWriteTopic] = useState<string>('');

  return (
    <GameContext.Provider value={{
      view, setView,
      gameMode, setGameMode,
      storyLevel, setStoryLevel,
      freeWriteTopic, setFreeWriteTopic,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
