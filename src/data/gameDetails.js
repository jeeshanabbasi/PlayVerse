import { gamesCatalog } from './games';
import {
  featuredGame,
  trendingGames,
  topRatedGames,
  newReleases,
  recommendedGames,
} from './home';

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
];

const DEVELOPERS = [
  'Aurora Labs',
  'Rift Interactive',
  'NeonForge Studio',
  'Quantum Pulse',
  'Voidworks',
  'Skyline Games',
  'Ember Pixel',
  'Chrome Orbit',
];

const PUBLISHERS = [
  'PlayVerse Originals',
  'Northline Publishing',
  'Asteroid House',
  'Blackout Media',
];

const FEATURES = [
  'Cross-play',
  'Cloud Saves',
  'Achievements',
  'Controller Support',
  'Ray Tracing Lite',
  'Co-op',
  'Ranked Matches',
  'Mods',
  'Spectator Mode',
  'Season Pass',
];

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese', 'Korean'];

const TAG_POOL = [
  'Competitive',
  'Story Rich',
  'Fast-Paced',
  'Atmospheric',
  'Replayable',
  'Indie',
  'Esports Ready',
  'Casual Friendly',
  'Open World',
  'Pixel Art',
];

const REVIEW_NAMES = [
  'NovaPulse',
  'KaiVoid',
  'AstraLyn',
  'RexUltra',
  'MiraFox',
  'Zenith',
  'LumenKid',
  'DriftFox',
];

const REVIEW_TEXT = [
  'Polished from the first match. The pacing feels AAA and the netcode is impressively stable for a browser title.',
  'Visuals slap, progression rewards skill, and the seasonal events keep me coming back every weekend.',
  'Not perfect — matchmaking can spike — but the core loop is addictive and the meta stays fresh.',
  'One of the best instant-play experiences on PlayVerse. Controllers feel native, not bolted on.',
  'Atmosphere is unreal. Sound design alone is worth the load. Highly recommended for late-night sessions.',
];

const COMMENT_TEXT = [
  'Anyone else hitting masters this season?',
  'Controller aim assist feels perfect after the latest patch.',
  'Need a squad for ranked tonight — EU servers.',
  'The new map is wild. Vertical play finally matters.',
  'Wish they add cross-save for mobile soon.',
];

const ACHIEVEMENTS = [
  { id: 'first-blood', name: 'First Blood', description: 'Win your first match', icon: '⚔️' },
  { id: 'streak-5', name: 'On Fire', description: 'Win 5 matches in a row', icon: '🔥' },
  { id: 'collector', name: 'Collector', description: 'Unlock 25 cosmetics', icon: '💎' },
  { id: 'night-owl', name: 'Night Owl', description: 'Play after midnight', icon: '🌙' },
  { id: 'tactician', name: 'Tactician', description: 'Win without taking damage', icon: '🧠' },
  { id: 'social', name: 'Squad Up', description: 'Play with 3 friends', icon: '🤝' },
];

function img(id, w = 1400) {
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

function pickMany(list, n, count, offset = 0) {
  const result = [];
  for (let i = 0; i < count; i += 1) {
    const item = pick(list, n, offset + i * 17);
    if (!result.includes(item)) result.push(item);
  }
  return result;
}

export function slugifyTitle(title) {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatReleaseDate(timestamp) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
}

function buildDetail(game, index) {
  const n = index + 1;
  const slug = game.id;
  const titleSlug = slugifyTitle(game.title);
  const playersOnline = Math.floor(800 + hash(n + 3) * 120_000);
  const ageRatings = ['E', 'E10+', 'T', 'M'];
  const sizes = ['120 MB', '340 MB', '780 MB', '1.2 GB', '2.4 GB'];

  const screenshots = Array.from({ length: 6 }, (_, i) => ({
    id: `${slug}-shot-${i + 1}`,
    src: img(unsplash[(n + i) % unsplash.length], 1600),
    alt: `${game.title} screenshot ${i + 1}`,
  }));

  const tags = pickMany(TAG_POOL, n, 4, 40);
  const features = pickMany(FEATURES, n, 5, 60);
  const languages = pickMany(LANGUAGES, n, 4, 80);

  const reviews = Array.from({ length: 4 }, (_, i) => ({
    id: `${slug}-review-${i + 1}`,
    name: pick(REVIEW_NAMES, n, 100 + i * 3),
    avatar: img(unsplash[(n + i + 2) % unsplash.length], 200),
    rating: Number((3.5 + hash(n + 130 + i) * 1.5).toFixed(1)),
    date: formatReleaseDate(Date.UTC(2026, Math.floor(hash(n + 140 + i) * 6), 2 + i * 3)),
    body: pick(REVIEW_TEXT, n, 150 + i),
  }));

  const comments = Array.from({ length: 3 }, (_, i) => ({
    id: `${slug}-comment-${i + 1}`,
    name: pick(REVIEW_NAMES, n, 200 + i * 5),
    avatar: img(unsplash[(n + i + 5) % unsplash.length], 200),
    date: `${i + 1}d ago`,
    body: pick(COMMENT_TEXT, n, 220 + i),
    likes: Math.floor(4 + hash(n + 240 + i) * 220),
    replies: i === 0
      ? [
          {
            id: `${slug}-reply-1`,
            name: pick(REVIEW_NAMES, n, 260),
            avatar: img(unsplash[(n + 8) % unsplash.length], 200),
            date: '12h ago',
            body: 'Same — EU lobbies have been smoother this week.',
            likes: Math.floor(2 + hash(n + 270) * 40),
          },
        ]
      : [],
  }));

  const achievements = ACHIEVEMENTS.map((item, i) => ({
    ...item,
    unlocked: hash(n + 300 + i) > 0.45,
    completion: Math.floor(12 + hash(n + 320 + i) * 88),
  }));

  const overallCompletion = Math.floor(
    achievements.reduce((sum, a) => sum + (a.unlocked ? a.completion : a.completion * 0.2), 0) /
      achievements.length,
  );

  return {
    ...game,
    slug,
    titleSlug,
    banner: img(unsplash[n % unsplash.length], 1920),
    logo: game.image,
    developer: pick(DEVELOPERS, n, 10),
    publisher: pick(PUBLISHERS, n, 12),
    releaseDate: formatReleaseDate(game.releasedAt),
    players: `${(playersOnline / 1000).toFixed(playersOnline > 10000 ? 0 : 1)}k`,
    playersOnline,
    size: pick(sizes, n, 14),
    ageRating: pick(ageRatings, n, 16),
    description: `${game.title} is a ${game.genres.join(' / ').toLowerCase()} experience built for the browser — instant launch, ranked progression, and cinematic polish without downloads.`,
    longDescription: `Step into ${game.title}, where every session starts at full speed. Designed for PlayVerse, this title blends competitive depth with accessible controls so anyone can jump in within seconds.

Across ${game.genres.join(' and ')} modes, you'll unlock cosmetics, climb seasonal ladders, and chase limited-time events. Whether you play solo or squad up, cloud saves and cross-platform sessions keep your progress synced.

Built by ${pick(DEVELOPERS, n, 10)} and published under ${pick(PUBLISHERS, n, 12)}, ${game.title} updates on a rapid cadence — new maps, balance passes, and creator tools drop regularly so the meta never goes cold.`,
    tags,
    features,
    languages,
    controllerSupport: hash(n + 18) > 0.25,
    online: true,
    offline: hash(n + 19) > 0.55,
    trailer: {
      title: `${game.title} Official Trailer`,
      thumbnail: img(unsplash[(n + 3) % unsplash.length], 1600),
      duration: 95 + Math.floor(hash(n + 20) * 80),
      src: null,
    },
    screenshots,
    systemRequirements: {
      minimum: {
        OS: 'Windows 10 / macOS 12 / ChromeOS',
        Browser: 'Chrome 110+, Edge 110+, Firefox 110+',
        Processor: 'Dual-core 2.0 GHz',
        Memory: '4 GB RAM',
        Graphics: 'Integrated GPU with WebGL 2.0',
        Storage: pick(sizes, n, 14),
        Network: 'Broadband internet',
      },
      recommended: {
        OS: 'Windows 11 / macOS 14',
        Browser: 'Chrome 120+ or Edge 120+',
        Processor: 'Quad-core 3.0 GHz',
        Memory: '8 GB RAM',
        Graphics: 'Dedicated GPU with WebGL 2.0',
        Storage: 'SSD recommended',
        Network: 'Low-latency broadband',
      },
    },
    reviews,
    comments,
    achievements,
    overallCompletion,
  };
}

const detailsCache = new Map();

function normalizeLooseGame(game, fallbackIndex = 0) {
  const releasedAt =
    game.releasedAt ??
    Date.UTC(2025, fallbackIndex % 12, 1 + (fallbackIndex % 27));

  return {
    id: game.id,
    title: game.title,
    image: game.image ?? game.cover ?? game.banner,
    genres: game.genres ?? ['Action'],
    platforms: game.platforms ?? ['web'],
    difficulty: game.difficulty ?? 'Medium',
    rating: game.rating ?? 4.5,
    plays: game.plays ?? 100000,
    price: game.price ?? 0,
    originalPrice: game.originalPrice,
    status: game.status ?? 'released',
    releasedAt,
    playTime: game.playTime ?? '2h',
    isNew: game.isNew ?? false,
    isTrending: game.isTrending ?? true,
    isFeatured: game.isFeatured ?? false,
  };
}

function getExternalGames() {
  const loose = [
    featuredGame,
    ...trendingGames,
    ...topRatedGames,
    ...newReleases,
    ...recommendedGames,
  ];

  const map = new Map();
  loose.forEach((game, index) => {
    if (!game?.id || map.has(game.id)) return;
    map.set(game.id, normalizeLooseGame(game, index + 200));
  });
  return [...map.values()];
}

const externalGames = getExternalGames();

export function getGameBySlug(slug) {
  if (!slug) return null;
  const normalized = String(slug).toLowerCase();

  const base =
    gamesCatalog.find(
      (game) =>
        game.id.toLowerCase() === normalized ||
        slugifyTitle(game.title) === normalized,
    ) ||
    externalGames.find(
      (game) =>
        game.id.toLowerCase() === normalized ||
        slugifyTitle(game.title) === normalized,
    );

  if (!base) return null;

  if (!detailsCache.has(base.id)) {
    const index = Math.max(
      0,
      gamesCatalog.findIndex((g) => g.id === base.id),
    );
    detailsCache.set(base.id, buildDetail(base, index || base.id.length));
  }

  return detailsCache.get(base.id);
}

export function getSimilarGames(slug, limit = 10) {
  const game = getGameBySlug(slug);
  if (!game) return [];

  return gamesCatalog
    .filter((item) => item.id !== game.id)
    .filter((item) => item.genres.some((g) => game.genres.includes(g)))
    .sort((a, b) => b.rating - a.rating || b.plays - a.plays)
    .slice(0, limit)
    .map((item) => getGameBySlug(item.id));
}
