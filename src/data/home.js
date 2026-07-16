const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const heroData = {
  brand: 'PlayVerse',
  heading: 'Explore Infinite Worlds',
  subtitle:
    'Discover thousands of browser games, compete with friends, and experience next-generation gaming.',
  backgroundImage: img('photo-1542751371-adc38448a05e', 1920),
  backgroundVideo: null,
  ctaPrimary: { label: 'Play Now', href: '/games' },
  ctaSecondary: { label: 'Browse Games', href: '/discover' },
};

export const featuredGame = {
  id: 'aurora-rift',
  title: 'Aurora Rift',
  tagline: 'Shatter the veil between worlds.',
  description:
    'A cinematic co-op shooter where neon ruins collide with ancient magic. Drop in solo or squad up — every run rewrites the map.',
  cover: img('photo-1511512578047-dfb367046420', 1400),
  banner: img('photo-1552820728-8b83bb6b773f', 1600),
  rating: 4.9,
  reviewCount: '18.4k',
  genres: ['Action', 'Co-op', 'Sci-Fi'],
  platforms: ['web', 'pc', 'mobile'],
  price: 0,
  badge: 'Featured',
  playersOnline: '42.1k',
};

export const trendingGames = [
  {
    id: 'neon-drift',
    title: 'Neon Drift',
    image: img('photo-1550745165-9bc0b252726f', 800),
    genres: ['Racing', 'Arcade'],
    rating: 4.7,
    price: 0,
  },
  {
    id: 'shadow-protocol',
    title: 'Shadow Protocol',
    image: img('photo-1493711662062-fa541adb3fc8', 800),
    genres: ['Stealth', 'Action'],
    rating: 4.8,
    price: 14.99,
    originalPrice: 24.99,
  },
  {
    id: 'crystal-siege',
    title: 'Crystal Siege',
    image: img('photo-1538481199705-c710c4ea671b', 800),
    genres: ['Strategy', 'PvP'],
    rating: 4.6,
    price: 0,
  },
  {
    id: 'orbit-ball',
    title: 'Orbit Ball',
    image: img('photo-1511882150382-421056c89033', 800),
    genres: ['Sports', 'Casual'],
    rating: 4.5,
    price: 9.99,
  },
  {
    id: 'void-runners',
    title: 'Void Runners',
    image: img('photo-1612287230202-1ff1d85d1bdf', 800),
    genres: ['Adventure', 'RPG'],
    rating: 4.9,
    price: 19.99,
    originalPrice: 29.99,
  },
  {
    id: 'pixel-pandemic',
    title: 'Pixel Pandemic',
    image: img('photo-1556438064-2d7646166914', 800),
    genres: ['Horror', 'Survival'],
    rating: 4.4,
    price: 0,
  },
];

export const continuePlaying = [
  {
    id: 'aurora-rift',
    title: 'Aurora Rift',
    image: img('photo-1511512578047-dfb367046420', 600),
    progress: 67,
    lastPlayed: '2 hours ago',
    chapter: 'Chapter 4 — Fracture',
  },
  {
    id: 'neon-drift',
    title: 'Neon Drift',
    image: img('photo-1550745165-9bc0b252726f', 600),
    progress: 41,
    lastPlayed: 'Yesterday',
    chapter: 'Season 2 Ranked',
  },
  {
    id: 'void-runners',
    title: 'Void Runners',
    image: img('photo-1612287230202-1ff1d85d1bdf', 600),
    progress: 88,
    lastPlayed: '3 days ago',
    chapter: 'Expedition: Hollow Core',
  },
];

export const categories = [
  { id: 'action', label: 'Action', description: 'High-intensity combat', accent: '#7C3AED', icon: 'Zap' },
  { id: 'adventure', label: 'Adventure', description: 'Epic journeys await', accent: '#22D3EE', icon: 'Compass' },
  { id: 'puzzle', label: 'Puzzle', description: 'Mind-bending challenges', accent: '#A78BFA', icon: 'Puzzle' },
  { id: 'arcade', label: 'Arcade', description: 'Pick up and play', accent: '#F472B6', icon: 'Joystick' },
  { id: 'strategy', label: 'Strategy', description: 'Outthink your rivals', accent: '#34D399', icon: 'Brain' },
  { id: 'racing', label: 'Racing', description: 'Speed without limits', accent: '#FB923C', icon: 'Gauge' },
  { id: 'sports', label: 'Sports', description: 'Compete and conquer', accent: '#38BDF8', icon: 'Trophy' },
  { id: 'horror', label: 'Horror', description: 'Survive the dark', accent: '#EF4444', icon: 'Skull' },
];

export const topRatedGames = [
  {
    id: 'eclipse-legends',
    title: 'Eclipse Legends',
    image: img('photo-1509198397868-475647b2a1e5', 800),
    genres: ['RPG', 'Fantasy'],
    rating: 4.95,
    price: 0,
    rank: 1,
  },
  {
    id: 'quantum-arena',
    title: 'Quantum Arena',
    image: img('photo-1551103782-8ab07afd45c1', 800),
    genres: ['PvP', 'Shooter'],
    rating: 4.9,
    price: 0,
    rank: 2,
  },
  {
    id: 'mythic-forge',
    title: 'Mythic Forge',
    image: img('photo-1579373903781-fd5c0e09a2d9', 800),
    genres: ['Crafting', 'Adventure'],
    rating: 4.88,
    price: 12.99,
    rank: 3,
  },
  {
    id: 'astra-dash',
    title: 'Astra Dash',
    image: img('photo-1606144042614-b2417e99c4e3', 800),
    genres: ['Platformer', 'Indie'],
    rating: 4.85,
    price: 0,
    rank: 4,
  },
];

export const newReleases = [
  {
    id: 'iron-synapse',
    title: 'Iron Synapse',
    image: img('photo-1593305841959-5c6ec7c1c1e2', 900),
    genres: ['Cyberpunk', 'Action'],
    rating: 4.7,
    price: 24.99,
    releasedAt: 'Released today',
  },
  {
    id: 'tidebound',
    title: 'Tidebound',
    image: img('photo-1518709268805-4e9042af9f23', 900),
    genres: ['Adventure', 'Exploration'],
    rating: 4.6,
    price: 0,
    releasedAt: '2 days ago',
  },
  {
    id: 'gridlock-zero',
    title: 'Gridlock Zero',
    image: img('photo-1552820728-8b83bb6b773f', 900),
    genres: ['Racing', 'Futuristic'],
    rating: 4.5,
    price: 14.99,
    releasedAt: 'This week',
  },
];

export const comingSoonGames = [
  {
    id: 'starfall-ops',
    title: 'Starfall Ops',
    image: img('photo-1451187580459-43490279c0fa', 900),
    releaseDate: '2026-08-12T18:00:00Z',
    dateLabel: 'Aug 12, 2026',
  },
  {
    id: 'ember-crown',
    title: 'Ember Crown',
    image: img('photo-1470229722913-7c0e2dbbafd3', 900),
    releaseDate: '2026-09-01T16:00:00Z',
    dateLabel: 'Sep 1, 2026',
  },
  {
    id: 'noir-circuit',
    title: 'Noir Circuit',
    image: img('photo-1550684848-fac1c5b4e853', 900),
    releaseDate: '2026-10-20T20:00:00Z',
    dateLabel: 'Oct 20, 2026',
  },
];

export const recommendedGames = [
  {
    id: 'lumen-tactics',
    title: 'Lumen Tactics',
    image: img('photo-1486572788966-cfd3df1f5b42', 800),
    genres: ['Strategy', 'Tactical'],
    rating: 4.8,
    price: 0,
    reason: 'Because you play strategy',
  },
  {
    id: 'skyward-duel',
    title: 'Skyward Duel',
    image: img('photo-1560253023-3ec5d502959f', 800),
    genres: ['Fighting', 'Arena'],
    rating: 4.7,
    price: 9.99,
    reason: 'Similar to Aurora Rift',
  },
  {
    id: 'whisper-woods',
    title: 'Whisper Woods',
    image: img('photo-1518709268805-4e9042af9f23', 800),
    genres: ['Horror', 'Story'],
    rating: 4.6,
    price: 0,
    reason: 'Trending in your region',
  },
  {
    id: 'cargo-legends',
    title: 'Cargo Legends',
    image: img('photo-1551103782-8ab07afd45c1', 800),
    genres: ['Simulation', 'Casual'],
    rating: 4.4,
    price: 7.99,
    reason: 'Friends are playing',
  },
];

export const communityHighlights = {
  creators: [
    {
      id: 'c1',
      name: 'NovaPulse',
      role: 'Creator',
      followers: '1.2M',
      avatar: img('photo-1535713875002-d1d0cf377fde', 200),
    },
    {
      id: 'c2',
      name: 'KaiVoid',
      role: 'Streamer',
      followers: '860K',
      avatar: img('photo-1527980965255-d3b416303d12', 200),
    },
    {
      id: 'c3',
      name: 'AstraLyn',
      role: 'Pro Guide',
      followers: '540K',
      avatar: img('photo-1494790108377-be9c29b29330', 200),
    },
  ],
  topPlayers: [
    { id: 'p1', name: 'RexUltra', rank: 1, score: '98,420', game: 'Quantum Arena' },
    { id: 'p2', name: 'MiraFox', rank: 2, score: '96,110', game: 'Neon Drift' },
    { id: 'p3', name: 'Zenith', rank: 3, score: '94,880', game: 'Crystal Siege' },
  ],
  challenge: {
    title: 'Weekly Challenge',
    name: 'Neon Endurance',
    description: 'Survive 20 minutes in Neon Drift without a crash.',
    reward: 'Exclusive Chassis Skin',
    endsIn: '2d 14h',
    participants: '128k',
  },
};

export const gamingNews = [
  {
    id: 'n1',
    title: 'Aurora Rift Season 3 brings dynamic rifts and new squad roles',
    excerpt: 'The veil expands with three playable classes and cross-platform ranked.',
    image: img('photo-1542751371-adc38448a05e', 800),
    category: 'Update',
    date: 'Jul 14, 2026',
    readTime: '4 min',
  },
  {
    id: 'n2',
    title: 'PlayVerse Creator Fund opens applications for indie studios',
    excerpt: 'Funding, mentoring, and featured placement for breakout browser titles.',
    image: img('photo-1511512578047-dfb367046420', 800),
    category: 'Platform',
    date: 'Jul 12, 2026',
    readTime: '3 min',
  },
  {
    id: 'n3',
    title: 'How top players are climbing Quantum Arena faster this season',
    excerpt: 'Meta breakdowns, utility timings, and the new patch shifts.',
    image: img('photo-1551103782-8ab07afd45c1', 800),
    category: 'Esports',
    date: 'Jul 10, 2026',
    readTime: '6 min',
  },
];

export const newsletterData = {
  title: 'Stay in the match',
  subtitle:
    'Weekly drops, early access invites, and exclusive PlayVerse rewards — straight to your inbox.',
  placeholder: 'Enter your email',
  cta: 'Join the List',
};
