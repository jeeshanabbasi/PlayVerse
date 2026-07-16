import { Home, Gamepad2, Trophy, Users, Compass } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'games', label: 'Games', path: '/games', icon: Gamepad2 },
  { id: 'discover', label: 'Discover', path: '/discover', icon: Compass },
  { id: 'leaderboard', label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { id: 'community', label: 'Community', path: '/community', icon: Users },
];

export const FOOTER_LINKS = {
  platform: [
    { label: 'Games', path: '/games' },
    { label: 'Discover', path: '/discover' },
    { label: 'Leaderboard', path: '/leaderboard' },
    { label: 'Community', path: '/community' },
  ],
  company: [
    { label: 'About', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
    { label: 'Contact', path: '/contact' },
  ],
  legal: [
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
    { label: 'Cookies', path: '/cookies' },
  ],
};

export const APP_NAME = 'PlayVerse';
export const APP_TAGLINE = 'Play without limits.';
