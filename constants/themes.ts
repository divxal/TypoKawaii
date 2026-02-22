import { Theme, ThemeConfig } from '../types';

export const THEME_CONFIG: Record<Theme, ThemeConfig> = {
  [Theme.Cinnamoroll]: {
    bg: 'bg-blue-50 dark:bg-slate-900',
    primary: 'bg-sky-400 dark:bg-sky-600',
    text: 'text-sky-900 dark:text-sky-100',
    border: 'border-sky-200 dark:border-sky-800',
    accent: 'text-sky-500 dark:text-sky-300',
    button: 'bg-sky-400 hover:bg-sky-500 text-white dark:bg-sky-600 dark:hover:bg-sky-700',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Cinnamoroll&backgroundColor=e0f7fa',
  },
  [Theme.Kuromi]: {
    bg: 'bg-purple-50 dark:bg-slate-900',
    primary: 'bg-purple-600 dark:bg-purple-800',
    text: 'text-purple-900 dark:text-purple-100',
    border: 'border-purple-200 dark:border-purple-900',
    accent: 'text-purple-600 dark:text-purple-300',
    button: 'bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-800 dark:hover:bg-purple-900',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Kuromi&backgroundColor=f3e5f5',
  },
  [Theme.MyMelody]: {
    bg: 'bg-pink-50 dark:bg-slate-900',
    primary: 'bg-pink-400 dark:bg-pink-600',
    text: 'text-pink-900 dark:text-pink-100',
    border: 'border-pink-200 dark:border-pink-800',
    accent: 'text-pink-500 dark:text-pink-300',
    button: 'bg-pink-400 hover:bg-pink-500 text-white dark:bg-pink-600 dark:hover:bg-pink-700',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Melody&backgroundColor=fce4ec',
  },
  [Theme.Pompompurin]: {
    bg: 'bg-yellow-50 dark:bg-slate-900',
    primary: 'bg-yellow-400 dark:bg-yellow-600',
    text: 'text-yellow-900 dark:text-yellow-100',
    border: 'border-yellow-200 dark:border-yellow-800',
    accent: 'text-yellow-600 dark:text-yellow-300',
    button: 'bg-yellow-400 hover:bg-yellow-500 text-black dark:bg-yellow-600 dark:text-white',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Purin&backgroundColor=fffde7',
  },
};
