import { getGameBySlug } from '../src/data/gameDetails.js';

try {
  const game = getGameBySlug('tic-tac-toe');
  console.log('Successfully retrieved game details!');
  console.log('Slug:', game?.slug);
  console.log('Title:', game?.title);
  console.log('Banners:', game?.banner);
  console.log('Achievements count:', game?.achievements?.length);
} catch (err) {
  console.error('Error fetching game details:', err);
}
