import React, { Component } from 'react';
import { Player } from '../Player/Player';
import { Suit, Card, CardImages, CardState } from '../Card';
import { IRoundProps } from './IRoundProps';
import { IRoundState} from './IRoundState';
import './Round.less';
import classNames from 'classnames/bind';

export class Round extends Component<IRoundProps, IRoundState> {
    players: Player[] = this.props.players;
    cards: JSX.Element[] = [];
    cardStates: CardState[] = [];
    turn: number = 0;
    isJack: boolean = false;
    created: number = Date.now();

    constructor(props: IRoundProps) {
        super(props);
        this.state = {
            cards: this.cards,
            topCard: this.cards[0],
            cardStates: this.cardStates,
            playerTurn: 0
          }
    }

    componentDidMount() {
        this.buildDeck();
    }

    buildDeck() {
        const suits: Suit[] = [Suit.spades, Suit.diamonds, Suit.clubs, Suit.hearts];
        const cardStates: CardState[] = [];
        const cards: JSX.Element[] = [];
        for (let i: number = 1; i <= 13; i++) {
            for (const i2 in suits) {
                let cardState = new CardState(i, suits[i2], true);
                cardStates.push(cardState);
                cards.push(<Card cardState={cardState} onClick={()=>{}}/>)
            }
        }
        this.setState({
            cards,
            cardStates,
            topCard: cards[0]
        })
    }

    addPlayer(oldPlayer: Player) {
        this.players.push(oldPlayer);
        this.players.sort((p1, p2) => {
            return p1.created - p2.created;
        });
    }

    render() {
        const { players } = this.props;
        const { topCard } = this.state;
        return (
        <div>
            <h1>Players: {players.map(player=> player.name)}</h1>
            <div className="card-table">
                {topCard}
            </div>
        </div>
        );
    }
}