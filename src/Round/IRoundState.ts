import { Card, CardState } from '../Card/';

export interface IRoundState {
  cards: JSX.Element[];
  cardStates: CardState[],
  topCard: JSX.Element,
  playerTurn: number
}