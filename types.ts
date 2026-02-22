export enum Theme {
  Cinnamoroll = 'cinnamoroll',
  Kuromi = 'kuromi',
  MyMelody = 'mymelody',
  Pompompurin = 'pompompurin',
}

export enum GameMode {
  Infinite = 'infinite',
  FreeWrite = 'freewrite',
  Story = 'story',
  DailyChallenge = 'daily',
}

export enum Rank {
  Unranked = 'Sin Rango',
  Iron = 'Hierro',
  Bronze = 'Bronce',
  Silver = 'Plata',
  Gold = 'Oro',
  Platinum = 'Platino',
  Diamond = 'Diamante',
  Master = 'Maestro',
  Grandmaster = 'Gran Maestro',
}

export interface UserStats {
  xp: number;
  level: number;
  gamesPlayed: number;
  highestWpm: number;
  rankInfinite: Rank;
  rankFreeWrite: Rank;
  storyProgress: number;
  achievements: string[];
  lastDailyCompleted: string | null;
  highestCombo: number;
}

export interface User {
  id: string;
  username: string;
  password?: string;
  avatarUrl: string;
  createdAt: string;
  stats: UserStats;
  friends: string[];
}

export interface GameResult {
  wpm: number;
  accuracy: number;
  correctChars: number;
  errorChars: number;
  punctuationErrors: number;
  timestamp: number;
  mode: GameMode;
  xpEarned: number;
  levelId?: number;
  isWin?: boolean;
  maxCombo: number;
}

export interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
  isOnline: boolean;
  status: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Level {
  id: number;
  name: string;
  text: string;
  minWpm: number;
  minAccuracy: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DailyChallenge {
  date: string;
  text: string;
  minWpm: number;
  minAccuracy: number;
  bonusXp: number;
}

export interface ThemeConfig {
  bg: string;
  primary: string;
  text: string;
  border: string;
  accent: string;
  button: string;
  avatar: string;
}

export type ViewType = 'dashboard' | 'game' | 'storyMap' | 'profile' | 'friends' | 'leaderboard';
