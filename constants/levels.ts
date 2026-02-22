import { Level, Rank } from '../types';

export const STORY_LEVELS: Level[] = [
  {
    id: 1,
    name: "El Comienzo Suave",
    text: "Cinnamoroll vuela feliz por el cielo azul. Sus orejas largas lo llevan lejos.",
    minWpm: 15,
    minAccuracy: 80,
  },
  {
    id: 2,
    name: "El Café de Canela",
    text: "Un día vio un café con olor a canela. Sus grandes orejas le permitieron volar suavemente hasta allí. El aroma era dulce y cálido.",
    minWpm: 20,
    minAccuracy: 82,
  },
  {
    id: 3,
    name: "Nuevos Amigos",
    text: "Al llegar al Café Cinnamon, se encontró con muchos amigos nuevos. Cappuccino es tranquilo y le gusta dormir la siesta bajo los árboles del jardín.",
    minWpm: 25,
    minAccuracy: 85,
  },
  {
    id: 4,
    name: "Moda y Diversión",
    text: "Mocha es elegante y le encanta la moda. Chiffon es enérgica y siempre está lista para jugar. Todos lo recibieron con una sonrisa cálida y un abrazo tierno.",
    minWpm: 30,
    minAccuracy: 87,
  },
  {
    id: 5,
    name: "La Carta Misteriosa",
    text: "Una mañana, Cinnamoroll encontró una carta misteriosa en su buzón. Decía: 'Ven al parque cuando salga la luna. Hay un secreto esperándote.' Sus amigos decidieron acompañarlo.",
    minWpm: 35,
    minAccuracy: 88,
  },
  {
    id: 6,
    name: "My Melody Aparece",
    text: "En el parque, My Melody los esperaba con una canasta llena de dulces. 'He preparado galletas para todos', dijo con su voz suave. El aroma a vainilla llenó el aire nocturno.",
    minWpm: 40,
    minAccuracy: 90,
  },
  {
    id: 7,
    name: "El Bosque Encantado",
    text: "Juntos caminaron hacia el bosque encantado. Las luciérnagas iluminaban el sendero con su luz dorada. Cada paso revelaba flores que brillaban en la oscuridad como pequeñas estrellas.",
    minWpm: 45,
    minAccuracy: 91,
  },
  {
    id: 8,
    name: "El Desafío de Kuromi",
    text: "Kuromi apareció de repente con su capucha negra. '¡Apuesto a que no puedes escribir más rápido que yo!', exclamó con una risa traviesa. Sus ojos brillaban con determinación.",
    minWpm: 50,
    minAccuracy: 92,
  },
  {
    id: 9,
    name: "La Competencia Amistosa",
    text: "Kuromi y Cinnamoroll compitieron escribiendo palabras a toda velocidad. Los demás animaban desde las gradas. Al final, ambos terminaron al mismo tiempo y se rieron juntos como buenos amigos.",
    minWpm: 55,
    minAccuracy: 93,
  },
  {
    id: 10,
    name: "El Tesoro Escondido",
    text: "Detrás de una cascada cristalina, encontraron un cofre dorado. Dentro había un mapa que mostraba el camino hacia el Festival de las Estrellas, el evento más mágico del año donde todos los personajes se reúnen.",
    minWpm: 60,
    minAccuracy: 94,
  },
  {
    id: 11,
    name: "Preparativos del Festival",
    text: "Todos trabajaron juntos para preparar el festival. Pompompurin cocinaba pasteles dorados, My Melody decoraba con flores de cerezo, y Kuromi sorprendió a todos tocando una melodía hermosa con su guitarra púrpura.",
    minWpm: 65,
    minAccuracy: 95,
  },
  {
    id: 12,
    name: "El Gran Final",
    text: "El Festival de las Estrellas comenzó al atardecer. Fuegos artificiales iluminaron el cielo mientras todos bailaban y cantaban. Cinnamoroll voló alto, dejando una estela de luz. '¡Gracias por esta aventura increíble!', gritó desde las nubes. Los amigos prometieron volver a reunirse cada año.",
    minWpm: 70,
    minAccuracy: 96,
  },
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
  BONUS_DAILY: 200,
  LEVEL_BASE: 1000,
  COMBO_MULTIPLIER_5: 2,
  COMBO_MULTIPLIER_10: 3,
  COMBO_MULTIPLIER_20: 5,
};

export const MOCK_LEADERBOARD = [
  { name: "Hello Kitty", wpm: 150, rank: Rank.Grandmaster, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kitty&backgroundColor=ffebee" },
  { name: "Kuromi", wpm: 142, rank: Rank.Grandmaster, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kuromi&backgroundColor=f3e5f5" },
  { name: "My Melody", wpm: 135, rank: Rank.Master, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Melody&backgroundColor=fce4ec" },
  { name: "Cinnamoroll", wpm: 128, rank: Rank.Master, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Cinnamoroll&backgroundColor=e0f7fa" },
  { name: "Pompompurin", wpm: 120, rank: Rank.Diamond, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Purin&backgroundColor=fffde7" },
  { name: "Keroppi", wpm: 110, rank: Rank.Diamond, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Keroppi&backgroundColor=e8f5e9" },
  { name: "Badtz-Maru", wpm: 105, rank: Rank.Platinum, avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Badtz&backgroundColor=eceff1" },
];
