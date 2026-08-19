const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const heroData = {
  brand: 'PlayVerse',
  heading: 'Explore Infinite Worlds',
  subtitle:
    'Discover thousands of browser games, compete with friends, and experience next-generation gaming.',
  backgroundImage: 'https://images.unsplash.com/photo-1538481199705-c710c4ea671b?auto=format&fit=crop&w=1920&q=80',
  backgroundVideo: null,
  ctaPrimary: { label: 'Play Now', href: '/games' },
  ctaSecondary: { label: 'Browse Games', href: '/discover' },
};

export const featuredGame = {
  id: 'tetris',
  title: 'Tetris',
  tagline: 'The legendary block-stacking classic.',
  description:
    'Experience the timeless puzzle game that defined a generation. Stack blocks, clear lines, and achieve high scores in this endless arcade challenge.',
  cover: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1400&q=80',
  banner: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1600&q=80',
  rating: 4.9,
  reviewCount: '68k',
  genres: ['Arcade', 'Puzzle', 'Retro'],
  platforms: ['web'],
  price: 0,
  badge: 'Classic',
  playersOnline: '24.5k',
};

export const trendingGames = [
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    image: img('photo-1594736797933-d0501ba2fe65', 800),
    genres: ['Arcade', 'Casual'],
    rating: 4.5,
    price: 0,
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    image: img('photo-1614613535308-eb5fbd219f90', 800),
    genres: ['Action', 'Arcade'],
    rating: 4.9,
    price: 0,
  },
  {
    id: 'cyber-boss',
    title: 'Cyber Boss: Overlord Zero',
    image: img('photo-1538481199705-c710c4ea671b', 800),
    genres: ['Action', 'Boss Battle'],
    rating: 5.0,
    price: 0,
  },
  {
    id: '2048',
    title: '2048',
    image: img('photo-1526374965328-7f5ae4e8b08e', 800),
    genres: ['Puzzle', 'Strategy'],
    rating: 4.8,
    price: 0,
  },
  {
    id: 'dino-run',
    title: 'Dino Run',
    image: img('photo-1600744222538-49ee1be9cf16', 800),
    genres: ['Arcade', 'Retro'],
    rating: 4.7,
    price: 0,
  },
  {
    id: 'snake',
    title: 'Snake',
    image: img('photo-1579373903781-fd5c0e09a2d9', 800),
    genres: ['Arcade', 'Retro'],
    rating: 4.9,
    price: 0,
  },
];

export const continuePlaying = [
  {
    id: 'tetris',
    title: 'Tetris',
    image: img('photo-1511882150382-421056c89033', 600),
    progress: 67,
    lastPlayed: '2 hours ago',
    chapter: 'Level 15',
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    image: img('photo-1594736797933-d0501ba2fe65', 600),
    progress: 41,
    lastPlayed: 'Yesterday',
    chapter: 'Score: 245',
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    image: img('photo-1614613535308-eb5fbd219f90', 600),
    progress: 88,
    lastPlayed: '3 days ago',
    chapter: 'Wave 12',
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
    id: 'tetris',
    title: 'Tetris',
    image: img('photo-1511882150382-421056c89033', 800),
    genres: ['Arcade', 'Puzzle'],
    rating: 4.95,
    price: 0,
    rank: 1,
  },
  {
    id: 'cyber-boss',
    title: 'Cyber Boss: Overlord Zero',
    image: img('photo-1538481199705-c710c4ea671b', 800),
    genres: ['Action', 'Boss Battle'],
    rating: 4.9,
    price: 0,
    rank: 2,
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    image: img('photo-1614613535308-eb5fbd219f90', 800),
    genres: ['Arcade', 'Action'],
    rating: 4.88,
    price: 0,
    rank: 3,
  },
  {
    id: 'snake',
    title: 'Snake',
    image: img('photo-1579373903781-fd5c0e09a2d9', 800),
    genres: ['Arcade', 'Retro'],
    rating: 4.85,
    price: 0,
    rank: 4,
  },
];

export const newReleases = [
  {
    id: 'cyber-boss',
    title: 'Cyber Boss: Overlord Zero',
    image: img('photo-1538481199705-c710c4ea671b', 900),
    genres: ['Action', 'Boss Battle'],
    rating: 5.0,
    price: 0,
    releasedAt: 'Released today',
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    image: img('photo-1614613535308-eb5fbd219f90', 900),
    genres: ['Arcade', 'Action'],
    rating: 4.9,
    price: 0,
    releasedAt: '2 days ago',
  },
  {
    id: 'dino-run',
    title: 'Dino Run',
    image: img('photo-1600744222538-49ee1be9cf16', 900),
    genres: ['Arcade', 'Retro'],
    rating: 4.7,
    price: 0,
    releasedAt: 'This week',
  },
];

export const comingSoonGames = [
  {
    id: 'space-shooter',
    title: 'Space Shooter',
    image: img('photo-1542751371-adc38448a05e', 900),
    releaseDate: '2026-08-25T18:00:00Z',
    dateLabel: 'Aug 25, 2026',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    image: img('photo-1559383331-cd4628902d4a', 900),
    releaseDate: '2026-09-01T16:00:00Z',
    dateLabel: 'Sep 1, 2026',
  },
  {
    id: 'pong',
    title: 'Pong (2-Player Versus)',
    image: img('photo-1552820728-8ac41f1ce891', 900),
    releaseDate: '2026-10-20T20:00:00Z',
    dateLabel: 'Oct 20, 2026',
  },
];

export const recommendedGames = [
  {
    id: 'sudoku',
    title: 'Sudoku',
    image: img('photo-1518156677180-95a2893f3e9f', 800),
    genres: ['Puzzle', 'Strategy'],
    rating: 4.7,
    price: 0,
    reason: 'Because you play puzzle games',
  },
  {
    id: 'memory-game',
    title: 'Memory Game',
    image: img('photo-1570303008389-8f8424e1bbd4', 800),
    genres: ['Puzzle', 'Casual'],
    rating: 4.7,
    price: 0,
    reason: 'Similar to 2048',
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    image: img('photo-1516975080664-ed2fc6a32937', 800),
    genres: ['Strategy', 'Puzzle'],
    rating: 4.8,
    price: 0,
    reason: 'Trending in your region',
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    image: img('photo-1611532736597-de2d4265fba3', 800),
    genres: ['Strategy', 'Puzzle'],
    rating: 4.6,
    price: 0,
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
    title: 'Tetris season updated with new power-ups and challenges',
    excerpt: 'New difficulty modes and leaderboard rankings now available.',
    image: img('photo-1511882150382-421056c89033', 800),
    category: 'Update',
    date: 'Aug 14, 2026',
    readTime: '4 min',
  },
  {
    id: 'n2',
    title: 'PlayVerse Creator Fund opens applications for indie studios',
    excerpt: 'Funding, mentoring, and featured placement for breakout browser titles.',
    image: img('photo-1614613535308-eb5fbd219f90', 800),
    category: 'Platform',
    date: 'Aug 12, 2026',
    readTime: '3 min',
  },
  {
    id: 'n3',
    title: 'How top players are mastering Space Invaders faster this season',
    excerpt: 'Strategy breakdowns, power-up timings, and the new patch shifts.',
    image: img('photo-1542751371-adc38448a05e', 800),
    category: 'Esports',
    date: 'Aug 10, 2026',
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
