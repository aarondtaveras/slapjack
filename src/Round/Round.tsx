import React, { Component } from 'react';
import { Player } from '../Player/Player';
import { Suit, Card, CardImages, CardState } from '../Card';
import { IRoundProps } from './IRoundProps';
import { IRoundState} from './IRoundState';
import './Round.css';
import classNames from 'classnames/bind';
import { MqttClient } from 'mqtt';

export class Round extends Component<IRoundProps, IRoundState> {
    players: Player[] = this.props.players;
    client: MqttClient = this.props.client;
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

        this.dealInPlayers = this.dealInPlayers.bind(this);
        this.handleSlap = this.handleSlap.bind(this);
    }

    componentDidMount() {
        this.initDeck();
    }

    shuffleDeck() {
        const shuffledStates = this.state.cardStates.sort(() => Math.random() - 0.5);
        const shuffledCards = shuffledStates.map(cardState => <Card cardState={cardState} onClick={()=>{}} />);
        this.setState({
            cardStates: shuffledStates,
            cards: shuffledCards,
            topCard: shuffledCards[0]
        });
        this.isJack = this.state.cardStates[0].value === 11;
    }

    handleSlap() {
        // send slap event to mqtt
        if (this.isJack) {
            console.log('JACK HAS BEEN SLAPDEDEDED');
        } else {
            console.log('jack has not been slappededed');
        }
    }

    dealInPlayers() {
        let startIdx: number = 1;
        const cardsPerPlayer: number = Math.floor(52/(this.players.length));
        let endIdx: number = cardsPerPlayer;
        this.players.forEach((player, idx) => {
            player.createHand(this.state.cardStates.slice(startIdx, endIdx));
            startIdx += cardsPerPlayer;
            endIdx = idx === this.players.length - 1 ? 51 : endIdx + cardsPerPlayer;  
        });
        this.players.forEach((player) => {
            console.log(player.hand);
        })
    }

    initDeck() {
        const suits: Suit[] = [Suit.spades, Suit.diamonds, Suit.clubs, Suit.hearts];
        const cardStates: CardState[] = [];
        for (let i: number = 1; i <= 13; i++) {
            for (const i2 in suits) {
                let cardState = new CardState(i, suits[i2], true);
                cardStates.push(cardState);
            }
        }
        // shuffle the deck
        cardStates.sort(()=> Math.random() - 0.5);
        const cards: JSX.Element[] = cardStates.map(cardState => <Card cardState={cardState} onClick={this.handleSlap}/>);
        this.setState({
            cardStates,
            cards,
            topCard: cards[0]
        }, () => {
            this.isJack = this.state.cardStates[0].value === 11;
        });
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
            <h1>Players: {players.map(player=> `${player.name}\n`)}</h1>
            <button onClick={this.dealInPlayers}>Start!</button>
            <div className="card-table">
                {topCard}
            </div>
        </div>
        );
    }
}