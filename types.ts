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
  storyProgress: number; // Highest level unlocked
}

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, this would be hashed. Storing plain for local mock.
  avatarUrl: string;
  createdAt: string; // ISO Date
  stats: UserStats;
  friends: string[]; // List of friend IDs
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
  levelId?: number; // For story mode
  isWin?: boolean; // For story mode
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
