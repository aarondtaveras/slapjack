import { Card } from '../Card/Card';

export class Player {
    name : string;
    hand: Card[] = [];
    created: number = Date.now();

    constructor(name: string) {
        this.name = name;
    }

    equals(otherPlayer: Player): boolean {
        return (this.name === otherPlayer.name &&
          this.hand.length === otherPlayer.hand.length &&
          this.created === otherPlayer.created);
    }
}