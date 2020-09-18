import { CardState } from '../Card/';
import { Player } from '../Player/Player';

export interface IRoundState {
  gameStarted: boolean,
  gameOver: boolean,
  players: Player[],
  topCard: JSX.Element | null
}