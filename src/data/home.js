const gameImage = (name) => `/games/${name}.jpg`;

function img(id, w = 1400) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;
}

export const heroData = {
  brand: 'PlayVerse',
  heading: 'Explore Infinite Worlds',
  subtitle:
    'Discover thousands of browser games, compete with friends, and experience next-generation gaming.',
  backgroundImage: gameImage('tetris'),
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
  cover: gameImage('tetris'),
  banner: gameImage('tetris'),
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
    image: gameImage('flappybird'),
    genres: ['Arcade', 'Casual'],
    rating: 4.5,
    price: 0,
  },
  {
    id: 'tetris',
    title: 'Tetris',
    image: gameImage('tetris'),
    genres: ['Arcade', 'Puzzle'],
    rating: 4.9,
    price: 0,
  },
  {
    id: '2048',
    title: '2048',
    image: gameImage('2048'),
    genres: ['Puzzle', 'Strategy'],
    rating: 4.8,
    price: 0,
  },
  {
    id: 'memory-game',
    title: 'Memory Game',
    image: gameImage('memory'),
    genres: ['Puzzle', 'Casual'],
    rating: 4.7,
    price: 0,
  },
  {
    id: 'snake',
    title: 'Snake',
    image: gameImage('snake'),
    genres: ['Arcade', 'Retro'],
    rating: 4.9,
    price: 0,
  },
  {
    id: 'breakout',
    title: 'Breakout',
    image: gameImage('breakout'),
    genres: ['Arcade', 'Retro'],
    rating: 4.6,
    price: 0,
  },
];

export const continuePlaying = [
  {
    id: 'tetris',
    title: 'Tetris',
    image: gameImage('tetris'),
    progress: 67,
    lastPlayed: '2 hours ago',
    chapter: 'Level 15',
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    image: gameImage('flappybird'),
    progress: 41,
    lastPlayed: 'Yesterday',
    chapter: 'Score: 245',
  },
  {
    id: 'snake',
    title: 'Snake',
    image: gameImage('snake'),
    progress: 88,
    lastPlayed: '3 days ago',
    chapter: 'Level 8',
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
    image: gameImage('tetris'),
    genres: ['Arcade', 'Puzzle'],
    rating: 4.95,
    price: 0,
    rank: 1,
  },
  {
    id: 'snake',
    title: 'Snake',
    image: gameImage('snake'),
    genres: ['Arcade', 'Retro'],
    rating: 4.9,
    price: 0,
    rank: 2,
  },
  {
    id: '2048',
    title: '2048',
    image: gameImage('2048'),
    genres: ['Puzzle', 'Strategy'],
    rating: 4.88,
    price: 0,
    rank: 3,
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    image: gameImage('flappybird'),
    genres: ['Arcade', 'Casual'],
    rating: 4.85,
    price: 0,
    rank: 4,
  },
];

export const newReleases = [
  {
    id: 'breakout',
    title: 'Breakout',
    image: gameImage('breakout'),
    genres: ['Arcade', 'Retro'],
    rating: 5.0,
    price: 0,
    releasedAt: 'Released today',
  },
  {
    id: 'tetris',
    title: 'Tetris',
    image: gameImage('tetris'),
    genres: ['Arcade', 'Puzzle'],
    rating: 4.9,
    price: 0,
    releasedAt: '2 days ago',
  },
  {
    id: 'memory-game',
    title: 'Memory Game',
    image: gameImage('memory'),
    genres: ['Puzzle', 'Casual'],
    rating: 4.7,
    price: 0,
    releasedAt: 'This week',
  },
];

export const comingSoonGames = [
  {
    id: 'pong',
    title: 'Pong (2-Player Versus)',
    image: gameImage('pong'),
    releaseDate: '2026-08-25T18:00:00Z',
    dateLabel: 'Aug 25, 2026',
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    image: gameImage('minesweeper'),
    releaseDate: '2026-09-01T16:00:00Z',
    dateLabel: 'Sep 1, 2026',
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    image: gameImage('sudoku'),
    releaseDate: '2026-10-20T20:00:00Z',
    dateLabel: 'Oct 20, 2026',
  },
];

export const recommendedGames = [
  {
    id: 'sudoku',
    title: 'Sudoku',
    image: gameImage('sudoku'),
    genres: ['Puzzle', 'Strategy'],
    rating: 4.7,
    price: 0,
    reason: 'Because you play puzzle games',
  },
  {
    id: 'memory-game',
    title: 'Memory Game',
    image: gameImage('memory'),
    genres: ['Puzzle', 'Casual'],
    rating: 4.7,
    price: 0,
    reason: 'Similar to 2048',
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    image: gameImage('tictactoe'),
    genres: ['Strategy', 'Puzzle'],
    rating: 4.8,
    price: 0,
    reason: 'Trending in your region',
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    image: gameImage('minesweeper'),
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
    image: gameImage('tetris'),
    category: 'Update',
    date: 'Aug 14, 2026',
    readTime: '4 min',
  },
  {
    id: 'n2',
    title: '2048 Masters tournament kicks off with $50K prize pool',
    excerpt: 'Top players compete globally in the largest puzzle game tournament.',
    image: gameImage('2048'),
    category: 'Tournament',
    date: 'Aug 10, 2026',
    readTime: '5 min',
  },
  {
    id: 'n3',
    title: 'Snake legend breaks the all-time high score record',
    excerpt: 'Pro player "SnakeKing" achieves unprecedented score of 999,999 points.',
    image: gameImage('snake'),
    category: 'Achievement',
    date: 'Aug 6, 2026',
    readTime: '3 min',
  },
];

  export const newsletterData = {
    title: 'Join Our Newsletter',
    subtitle: 'Get the latest updates, tips, and exclusive game releases delivered to your inbox.',
    placeholder: 'Enter your email address',
    buttonText: 'Subscribe',
    successMessage: 'Thanks for subscribing! Check your email for confirmation.',
  };
