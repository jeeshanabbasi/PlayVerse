import { Home, Gamepad2, Info, Search } from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', path: '/', icon: Home },
  { id: 'games', label: 'Games', path: '/games', icon: Gamepad2 },
  { id: 'search', label: 'Search', path: '/search', icon: Search },
  { id: 'about', label: 'About', path: '/about', icon: Info },
];

export const FOOTER_LINKS = {
  platform: [
    { label: 'Games', path: '/games' },
    { label: 'About PlayVerse', path: '/about' },
  ],
  company: [
    { label: 'Platform Status', path: '/about' },
    { label: 'Repository', path: '/about' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms of Service', path: '/terms' },
  ],
};

export const APP_NAME = 'PlayVerse';
export const APP_TAGLINE = 'Polished browser games, instant play.';
