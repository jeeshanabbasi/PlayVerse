const unsplash = [
  'photo-1542751371-adc38448a05e',
  'photo-1511512578047-dfb367046420',
  'photo-1550745165-9bc0b252726f',
  'photo-1493711662062-fa541adb3fc8',
  'photo-1538481199705-c710c4ea671b',
  'photo-1511882150382-421056c89033',
  'photo-1612287230202-1ff1d85d1bdf',
  'photo-1556438064-2d7646166914',
  'photo-1509198397868-475647b2a1e5',
  'photo-1551103782-8ab07afd45c1',
  'photo-1579373903781-fd5c0e09a2d9',
  'photo-1606144042614-b2417e99c4e3',
  'photo-1593305841959-5c6ec7c1c1e2',
  'photo-1518709268805-4e9042af9f23',
  'photo-1552820728-8b83bb6b773f',
  'photo-1451187580459-43490279c0fa',
  'photo-1470229722913-7c0e2dbbafd3',
  'photo-1550684848-fac1c5b4e853',
  'photo-1486572788966-cfd3df1f5b42',
  'photo-1560253023-3ec5d502959f',
];

const GENRES = [
  'Action',
  'Adventure',
  'Puzzle',
  'Arcade',
  'Strategy',
  'Racing',
  'Sports',
  'Horror',
  'RPG',
  'Shooter',
  'Simulation',
  'Fighting',
];

const PLATFORMS = ['web', 'pc', 'mobile'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Extreme'];
const STATUSES = ['released', 'early-access', 'coming-soon', 'beta'];

const PREFIXES = [
  'Neon', 'Shadow', 'Crystal', 'Void', 'Quantum', 'Aurora', 'Iron', 'Mythic',
  'Astra', 'Pixel', 'Orbit', 'Ember', 'Noir', 'Lumen', 'Skyward', 'Cargo',
  'Eclipse', 'Storm', 'Frost', 'Hyper', 'Cyber', 'Pulse', 'Rift', 'Chrome',
  'Solar', 'Nova', 'Phantom', 'Turbo', 'Prime', 'Omega', 'Apex', 'Drift',
];

const SUFFIXES = [
  'Protocol', 'Siege', 'Drift', 'Runners', 'Arena', 'Legends', 'Forge', 'Dash',
  'Synapse', 'Ops', 'Crown', 'Circuit', 'Tactics', 'Duel', 'Woods', 'Zero',
  'Rift', 'Pandemic', 'Ball', 'Dawn', 'Front', 'Quest', 'Rush', 'Strike',
  'Empire', 'Horizon', 'Clash', 'Worlds', 'Legacy', 'Ascend', 'Velocity', 'Core',
];

function img(id, w = 800) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

function hash(n) {
  let x = n * 2654435761;
  x = Math.imul(x ^ (x >>> 16), 2246822507);
  x = Math.imul(x ^ (x >>> 13), 3266489909);
  return (x >>> 0) / 4294967296;
}

function pick(list, n, offset = 0) {
  return list[Math.floor(hash(n + offset) * list.length) % list.length];
}

function buildGame(index) {
  const n = index + 1;
  const title = `${pick(PREFIXES, n, 1)} ${pick(SUFFIXES, n, 7)}`;
  const primaryGenre = pick(GENRES, n, 3);
  const secondary = pick(GENRES, n, 11);
  const genres = secondary === primaryGenre ? [primaryGenre] : [primaryGenre, secondary];
  const rating = Number((3.4 + hash(n + 21) * 1.55).toFixed(1));
  const plays = Math.floor(1200 + hash(n + 33) * 2_400_000);
  const releasedAt = Date.UTC(2024, Math.floor(hash(n + 44) * 12), 1 + Math.floor(hash(n + 55) * 27));
  const status = pick(STATUSES, n, 9);
  const priceRoll = hash(n + 66);
  const price = priceRoll > 0.55 ? 0 : Number((4.99 + Math.floor(hash(n + 77) * 8) * 2.5).toFixed(2));
  const originalPrice = price > 0 && hash(n + 88) > 0.7 ? Number((price + 10).toFixed(2)) : undefined;
  const playMinutes = 15 + Math.floor(hash(n + 99) * 180);
  const platforms = PLATFORMS.filter((_, i) => hash(n + 110 + i) > 0.35);
  const badgeRoll = hash(n + 120);

  return {
    id: `game-${String(n).padStart(3, '0')}`,
    title,
    image: img(unsplash[n % unsplash.length]),
    genres,
    platforms: platforms.length ? platforms : ['web'],
    difficulty: pick(DIFFICULTIES, n, 15),
    rating,
    plays,
    price,
    originalPrice,
    status,
    releasedAt,
    playTime: playMinutes < 60 ? `${playMinutes}m` : `${Math.round(playMinutes / 60)}h`,
    isNew: badgeRoll > 0.82 || status === 'early-access',
    isTrending: badgeRoll > 0.88 || plays > 1_500_000,
    isFeatured: n % 17 === 0,
  };
}

export const GAME_GENRES = GENRES;
export const GAME_PLATFORMS = PLATFORMS;
export const GAME_DIFFICULTIES = DIFFICULTIES;
export const GAME_STATUSES = STATUSES;

export const GAME_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'trending', label: 'Trending' },
  { value: 'most-played', label: 'Most Played' },
  { value: 'highest-rated', label: 'Highest Rated' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

export const QUICK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'free', label: 'Free to Play' },
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New' },
  { id: 'multiplayer', label: 'Multiplayer' },
  { id: 'singleplayer', label: 'Singleplayer' },
];

export const RATING_FILTERS = [
  { value: 'any', label: 'Any rating' },
  { value: '4.5', label: '4.5+' },
  { value: '4', label: '4.0+' },
  { value: '3.5', label: '3.5+' },
];

export const POPULARITY_FILTERS = [
  { value: 'any', label: 'Any popularity' },
  { value: 'hot', label: 'Hot (1M+)' },
  { value: 'popular', label: 'Popular (100K+)' },
  { value: 'rising', label: 'Rising' },
];

export const STATUS_FILTER_OPTIONS = [
  { value: 'any', label: 'Any status' },
  { value: 'released', label: 'Released' },
  { value: 'early-access', label: 'Early Access' },
  { value: 'coming-soon', label: 'Coming Soon' },
  { value: 'beta', label: 'Beta' },
];

export const gamesCatalog = Array.from({ length: 120 }, (_, i) => buildGame(i));

export const recentlyPlayedGames = [
  {
    id: 'game-001',
    title: gamesCatalog[0].title,
    image: gamesCatalog[0].image,
    progress: 67,
    lastPlayed: '2 hours ago',
    chapter: 'Chapter 4',
  },
  {
    id: 'game-014',
    title: gamesCatalog[13].title,
    image: gamesCatalog[13].image,
    progress: 41,
    lastPlayed: 'Yesterday',
    chapter: 'Season Ranked',
  },
  {
    id: 'game-027',
    title: gamesCatalog[26].title,
    image: gamesCatalog[26].image,
    progress: 88,
    lastPlayed: '3 days ago',
    chapter: 'Finale Arc',
  },
  {
    id: 'game-042',
    title: gamesCatalog[41].title,
    image: gamesCatalog[41].image,
    progress: 22,
    lastPlayed: 'Last week',
    chapter: 'Tutorial Zone',
  },
];

export function getTrendingGames(limit = 12) {
  return [...gamesCatalog]
    .sort((a, b) => Number(b.isTrending) - Number(a.isTrending) || b.plays - a.plays)
    .slice(0, limit);
}
