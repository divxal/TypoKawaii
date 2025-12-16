import { Level, Rank, Theme } from './types';

export const THEME_CONFIG = {
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

export const COMMON_WORDS_ES = [
  "el", "la", "de", "que", "y", "en", "un", "ser", "a", "él", "lo", "no", "haber", "por", "con", "su", "para", "como", "estar", "tener", "le", "todo", "pero", "más", "hacer", "o", "poder", "decir", "este", "ir", "otro", "ese", "la", "si", "me", "ya", "ver", "porque", "dar", "cuando", "él", "muy", "sin", "vez", "mucho", "saber", "qué", "sobre", "mi", "alguno", "mismo", "yo", "también", "hasta", "año", "dos", "querer", "entre", "así", "primero", "desde", "grande", "eso", "ni", "nos", "llegar", "pasar", "tiempo", "ella", "sí", "día", "uno", "bien", "poco", "deber", "entonces", "poner", "cosa", "tanto", "hombre", "parecer", "nuestro", "tan", "donde", "ahora", "parte", "después", "vida", "quedar", "siempre", "creer", "hablar", "llevar", "dejar", "nada", "cada", "seguir", "menos", "nuevo", "encontrar", "cielo", "azul", "nube", "perro", "gato", "lindo", "dulce", "pastel", "jugar", "correr", "dormir", "soñar", "feliz", "triste", "rapido", "lento", "fuego", "agua", "tierra", "aire", "espacio", "estrella", "luna", "sol", "flor", "arbol", "bosque", "playa", "mar", "oceano", "montaña", "nieve", "lluvia", "viento", "tormenta", "rayo", "trueno", "color", "pintura", "arte", "musica", "cancion", "baile", "libro", "historia", "cuento", "poesia", "verso", "rima", "palabra", "letra", "idioma", "voz", "sonido", "silencio", "ruido", "grito", "susurro", "mirada", "ojo", "boca", "mano", "pie", "cabeza", "corazon", "alma", "espiritu", "mente", "pensamiento", "idea", "razon", "verdad", "mentira", "secreto", "misterio", "magia", "poder", "fuerza", "valor", "miedo", "amor", "odio", "paz", "guerra", "batalla", "lucha", "victoria", "derrota", "exito", "fracaso", "inicio", "fin", "principio", "final", "centro", "borde", "lado", "arriba", "abajo", "dentro", "fuera", "lejos", "cerca", "aqui", "alli", "alla", "ayer", "hoy", "mañana", "nunca", "jamas", "siempre", "pronto", "tarde", "temprano", "antes", "despues", "luego", "mientras", "durante", "cafe", "te", "leche", "jugo", "fruta", "pan", "queso", "carne", "pollo", "pescado", "arroz", "pasta", "sopa", "ensalada", "postre", "helado", "chocolate", "galleta", "caramelo"
];

// Rebalanced levels. Level 1 is significantly easier.
export const STORY_LEVELS: Level[] = [
  {
    id: 1,
    name: "El Comienzo Suave",
    text: "Cinnamoroll vuela feliz.",
    minWpm: 15, // Reduced from 20
    minAccuracy: 80 // Reduced from 85
  },
  {
    id: 2,
    name: "El Café de Canela",
    text: "Un día vio un café con olor a canela. Sus grandes orejas le permitieron volar suavemente hasta allí.",
    minWpm: 25,
    minAccuracy: 85
  },
  {
    id: 3,
    name: "Nuevos Amigos",
    text: "Al llegar al Café Cinnamon, se encontró con muchos amigos nuevos. Cappuccino es tranquilo y le gusta dormir la siesta.",
    minWpm: 35,
    minAccuracy: 90
  },
  {
    id: 4,
    name: "Moda y Diversión",
    text: "Mocha es elegante y le encanta la moda. Chiffon es enérgica y siempre está lista para jugar. Todos lo recibieron con una sonrisa.",
    minWpm: 45,
    minAccuracy: 92
  },
  {
    id: 5,
    name: "El Desafío de Kuromi",
    text: "Kuromi apareció de repente con su capucha negra. '¡Apuesto a que no puedes escribir más rápido que yo!', exclamó con una risa traviesa.",
    minWpm: 55,
    minAccuracy: 94
  },
  {
    id: 6,
    name: "El Gran Final",
    text: "Pompompurin, con su boina marrón, tropezó y dejó caer todos sus zapatos. ¡Hay que ayudarlo a recogerlos escribiendo rápido! Corre, salta y escribe sin parar.",
    minWpm: 65,
    minAccuracy: 96
  }
];

export const CALCULATE_RANK = (wpm: number, accuracy: number): Rank => {
  const score = wpm * (accuracy / 100);
  if (score < 20) return Rank.Iron;
  if (score < 40) return Rank.Bronze;
  if (score < 60) return Rank.Silver;
  if (score < 80) return Rank.Gold;
  if (score < 100) return Rank.Platinum;
  if (score < 120) return Rank.Diamond;
  if (score < 140) return Rank.Master;
  return Rank.Grandmaster;
};

export const XP_TABLE = {
  PER_CHAR: 1,
  BONUS_ACCURACY: 50,
  BONUS_WIN: 100,
  LEVEL_BASE: 1000,
};

export const TOPICS = [
  "La Amistad", "El Verano", "Mis Sueños", "Comida Favorita", "Viajes Espaciales", "Música Pop", "Videojuegos", "La Naturaleza"
];

// Mock Leaderboard Data with Sanrio Characters
export const MOCK_LEADERBOARD = [
  { name: "Hello Kitty", wpm: 150, rank: Rank.Grandmaster, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kitty&backgroundColor=ffebee" },
  { name: "Kuromi", wpm: 142, rank: Rank.Grandmaster, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kuromi&backgroundColor=f3e5f5" },
  { name: "My Melody", wpm: 135, rank: Rank.Master, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Melody&backgroundColor=fce4ec" },
  { name: "Cinnamoroll", wpm: 128, rank: Rank.Master, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Cinnamoroll&backgroundColor=e0f7fa" },
  { name: "Pompompurin", wpm: 120, rank: Rank.Diamond, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Purin&backgroundColor=fffde7" },
  { name: "Keroppi", wpm: 110, rank: Rank.Diamond, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Keroppi&backgroundColor=e8f5e9" },
  { name: "Badtz-Maru", wpm: 105, rank: Rank.Platinum, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Badtz&backgroundColor=eceff1" },
];
