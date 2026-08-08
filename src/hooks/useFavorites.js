import { useState, useEffect, useCallback } from 'react';
import { playUiClick } from '@utils/index';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem('playverse_favorites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const raw = localStorage.getItem('playverse_favorites');
        setFavorites(raw ? JSON.parse(raw) : []);
      } catch {
        setFavorites([]);
      }
    };
    window.addEventListener('playverse_favorites_updated', handleUpdate);
    return () => window.removeEventListener('playverse_favorites_updated', handleUpdate);
  }, []);

  const isFavorite = useCallback(
    (slug) => favorites.includes(slug),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (slug, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      playUiClick();
      try {
        const raw = localStorage.getItem('playverse_favorites');
        let current = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(current)) current = [];

        let next;
        if (current.includes(slug)) {
          next = current.filter((id) => id !== slug);
        } else {
          next = [...current, slug];
        }

        localStorage.setItem('playverse_favorites', JSON.stringify(next));
        setFavorites(next);
        window.dispatchEvent(new Event('playverse_favorites_updated'));
      } catch {
        // fail silently
      }
    },
    []
  );

  return { favorites, isFavorite, toggleFavorite };
}
export default useFavorites;
