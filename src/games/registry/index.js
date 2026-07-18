import { GameRegistry } from '../core/GameRegistry';
import { enginePlaceholderDefinition } from './placeholder';
import { snakeDefinition } from './snake';
import { ticTacToeDefinition } from './ticTacToe/manifest';
import { memoryGameDefinition } from './memoryGame/manifest';
import { twentyFortyEightDefinition } from './twentyFortyEight/manifest';
import { minesweeperDefinition } from './minesweeper/manifest';
import { sudokuDefinition } from './sudoku/manifest';
import { tetrisDefinition } from './tetris/manifest';
import { flappyBirdDefinition } from './flappyBird/manifest';
import { pongDefinition } from './pong/manifest';
import { breakoutDefinition } from './breakout/manifest';
import { dinoRunDefinition } from './dinoRun/manifest';
import { spaceShooterDefinition } from './spaceShooter/manifest';

export function ensurePlaceholderRegistered() {
  if (!GameRegistry.has(enginePlaceholderDefinition.id)) {
    GameRegistry.register(enginePlaceholderDefinition);
  }
  if (!GameRegistry.has(snakeDefinition.id)) GameRegistry.register(snakeDefinition);
  if (!GameRegistry.has(ticTacToeDefinition.id)) GameRegistry.register(ticTacToeDefinition);
  if (!GameRegistry.has(memoryGameDefinition.id)) GameRegistry.register(memoryGameDefinition);
  if (!GameRegistry.has(twentyFortyEightDefinition.id)) GameRegistry.register(twentyFortyEightDefinition);
  if (!GameRegistry.has(minesweeperDefinition.id)) GameRegistry.register(minesweeperDefinition);
  if (!GameRegistry.has(sudokuDefinition.id)) GameRegistry.register(sudokuDefinition);
  if (!GameRegistry.has(tetrisDefinition.id)) GameRegistry.register(tetrisDefinition);
  if (!GameRegistry.has(flappyBirdDefinition.id)) GameRegistry.register(flappyBirdDefinition);
  if (!GameRegistry.has(pongDefinition.id)) GameRegistry.register(pongDefinition);
  if (!GameRegistry.has(breakoutDefinition.id)) GameRegistry.register(breakoutDefinition);
  if (!GameRegistry.has(dinoRunDefinition.id)) GameRegistry.register(dinoRunDefinition);
  if (!GameRegistry.has(spaceShooterDefinition.id)) GameRegistry.register(spaceShooterDefinition);
}

export function resolvePlayableDefinition(slug) {
  ensurePlaceholderRegistered();
  const registered = GameRegistry.get(slug);
  if (registered) return registered;
  return {
    ...enginePlaceholderDefinition,
    id: slug || enginePlaceholderDefinition.id,
    title: slug ? `Awaiting: ${slug}` : enginePlaceholderDefinition.title,
  };
}

export * from './placeholder';
export * from './snake';
export * from './ticTacToe/manifest';
export * from './memoryGame/manifest';
export * from './twentyFortyEight/manifest';
export * from './minesweeper/manifest';
export * from './sudoku/manifest';
export * from './tetris/manifest';
export * from './flappyBird/manifest';
export * from './pong/manifest';
export * from './breakout/manifest';
export * from './dinoRun/manifest';
export * from './spaceShooter/manifest';
