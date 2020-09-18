import { Card, CardState, CardImages } from '../Card';

export class Player {
    name : string;
    hand: CardState[] = [];
    created: number = Date.now();

    constructor(name: string, hand: CardState[] = []) {
        this.name = name;
        this.hand = hand;
    }

    equals(otherPlayer: Player): boolean {
        return (this.name === otherPlayer.name &&
          this.hand.length === otherPlayer.hand.length &&
          this.created === otherPlayer.created);
    }
}