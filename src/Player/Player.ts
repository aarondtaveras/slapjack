import { Card, CardState, CardImages } from '../Card';

export class Player {
    name : string;
    hand: Card[] = [];
    created: number = Date.now();

    constructor(name: string) {
        this.name = name;
    }

    createHand(cardStates: CardState[]) {
        this.hand = cardStates.map(cardState => new Card({
            cardState, 
            onClick: ()=>{} 
        }));
    }

    equals(otherPlayer: Player): boolean {
        return (this.name === otherPlayer.name &&
          this.hand.length === otherPlayer.hand.length &&
          this.created === otherPlayer.created);
    }
}