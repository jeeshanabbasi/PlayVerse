import { useState, useEffect, useCallback } from 'react';
import { getStoredJson, playUiClick, setStoredItem } from '@utils/index';

function readFavorites() {
  const list = getStoredJson('playverse_favorites', []);
  return Array.isArray(list) ? list.filter(Boolean) : [];
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => readFavorites());

  useEffect(() => {
    const handleUpdate = () => {
      setFavorites(readFavorites());
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

      const current = readFavorites();
      const next = current.includes(slug)
        ? current.filter((id) => id !== slug)
        : [...current, slug];

      setStoredItem('playverse_favorites', JSON.stringify(next));
      setFavorites(next);
      window.dispatchEvent(new Event('playverse_favorites_updated'));
    },
    []
  );

  return { favorites, isFavorite, toggleFavorite };
}
export default useFavorites;
