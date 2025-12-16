import { User, UserStats, Rank } from '../types';

const USERS_KEY = 'typokawaii_users';
const CURRENT_USER_KEY = 'typokawaii_current_user_id';

const getDB = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveDB = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = (username: string, password: string): User | null => {
  const users = getDB();
  if (users.find(u => u.username === username)) {
    return null; // User exists
  }

  const newUser: User = {
    id: 'user-' + Date.now(),
    username,
    password, 
    avatarUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=${username}`,
    createdAt: new Date().toISOString(),
    stats: {
      xp: 0,
      level: 1,
      gamesPlayed: 0,
      highestWpm: 0,
      rankInfinite: Rank.Unranked,
      rankFreeWrite: Rank.Unranked,
      storyProgress: 1 // Starts at level 1
    },
    friends: []
  };

  users.push(newUser);
  saveDB(users);
  return newUser;
};

export const loginUser = (username: string, password: string): User | null => {
  const users = getDB();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    return user;
  }
  return null;
};

export const getCurrentUser = (): User | null => {
  const id = localStorage.getItem(CURRENT_USER_KEY);
  if (!id) return null;
  const users = getDB();
  return users.find(u => u.id === id) || null;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const updateUserInDB = (updatedUser: User) => {
  const users = getDB();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveDB(users);
    // Also update current session if matches
    if (localStorage.getItem(CURRENT_USER_KEY) === updatedUser.id) {
       // Logic handled by App state usually, but good to keep synced
    }
  }
};
