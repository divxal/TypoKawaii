import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, GameResult, GameMode, Rank } from '../types';
import { CALCULATE_RANK, XP_TABLE, STORY_LEVELS } from '../constants/levels';
import { ACHIEVEMENTS } from '../constants/achievements';
import { getCurrentUser, logoutUser, updateUserInDB } from '../services/storageService';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  handleLogout: () => void;
  updateStats: (result: GameResult) => void;
  checkAchievements: (result: GameResult) => string[];
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const existingUser = getCurrentUser();
    if (existingUser) {
      // Migrate old users that don't have new fields
      if (!existingUser.stats.achievements) existingUser.stats.achievements = [];
      if (!existingUser.stats.lastDailyCompleted) existingUser.stats.lastDailyCompleted = null;
      if (existingUser.stats.highestCombo === undefined) existingUser.stats.highestCombo = 0;
      setUser(existingUser);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const checkAchievements = (result: GameResult): string[] => {
    if (!user) return [];
    const newAchievements: string[] = [];
    const currentAchievements = user.stats.achievements || [];

    const check = (id: string, condition: boolean) => {
      if (condition && !currentAchievements.includes(id)) {
        newAchievements.push(id);
      }
    };

    check('first_game', user.stats.gamesPlayed >= 0); // Will be 0, about to increment
    check('speed_50', result.wpm >= 50);
    check('speed_100', result.wpm >= 100);
    check('perfect', result.accuracy === 100);
    check('marathon_10', user.stats.gamesPlayed + 1 >= 10);
    check('marathon_50', user.stats.gamesPlayed + 1 >= 50);
    check('story_complete', result.mode === GameMode.Story && result.isWin && result.levelId === STORY_LEVELS.length);
    check('combo_10', result.maxCombo >= 10);
    check('combo_25', result.maxCombo >= 25);
    check('rank_gold', CALCULATE_RANK(Math.max(user.stats.highestWpm, result.wpm), result.accuracy) === Rank.Gold ||
      CALCULATE_RANK(Math.max(user.stats.highestWpm, result.wpm), result.accuracy) === Rank.Platinum ||
      CALCULATE_RANK(Math.max(user.stats.highestWpm, result.wpm), result.accuracy) === Rank.Diamond ||
      CALCULATE_RANK(Math.max(user.stats.highestWpm, result.wpm), result.accuracy) === Rank.Master ||
      CALCULATE_RANK(Math.max(user.stats.highestWpm, result.wpm), result.accuracy) === Rank.Grandmaster);
    check('rank_master', CALCULATE_RANK(Math.max(user.stats.highestWpm, result.wpm), result.accuracy) === Rank.Master ||
      CALCULATE_RANK(Math.max(user.stats.highestWpm, result.wpm), result.accuracy) === Rank.Grandmaster);

    return newAchievements;
  };

  const updateStats = (result: GameResult) => {
    if (!user) return;

    const newAchievements = checkAchievements(result);

    const newXp = user.stats.xp + result.xpEarned;
    const newLevel = Math.floor(newXp / XP_TABLE.LEVEL_BASE) + 1;
    const newHighestWpm = Math.max(user.stats.highestWpm, result.wpm);
    const newHighestCombo = Math.max(user.stats.highestCombo || 0, result.maxCombo);

    let newRankInfinite = user.stats.rankInfinite;
    let newRankFree = user.stats.rankFreeWrite;
    let newStoryProgress = user.stats.storyProgress;

    if (result.mode === GameMode.Infinite) {
      newRankInfinite = CALCULATE_RANK(newHighestWpm, result.accuracy);
    } else if (result.mode === GameMode.FreeWrite) {
      newRankFree = CALCULATE_RANK(newHighestWpm, result.accuracy);
    } else if (result.mode === GameMode.Story && result.isWin && result.levelId === user.stats.storyProgress) {
      newStoryProgress = Math.min(STORY_LEVELS.length, user.stats.storyProgress + 1);
    }

    const updatedUser: User = {
      ...user,
      stats: {
        ...user.stats,
        xp: newXp,
        level: newLevel,
        gamesPlayed: user.stats.gamesPlayed + 1,
        highestWpm: newHighestWpm,
        highestCombo: newHighestCombo,
        rankInfinite: newRankInfinite,
        rankFreeWrite: newRankFree,
        storyProgress: newStoryProgress,
        achievements: [...(user.stats.achievements || []), ...newAchievements],
        lastDailyCompleted: result.mode === GameMode.DailyChallenge && result.isWin
          ? new Date().toISOString().split('T')[0]
          : user.stats.lastDailyCompleted,
      },
    };

    setUser(updatedUser);
    updateUserInDB(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogout, updateStats, checkAchievements }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
