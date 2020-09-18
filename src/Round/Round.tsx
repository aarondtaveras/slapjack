import React, { Component } from 'react';
import { Player } from '../Player/Player';
import { Suit, Card, CardState } from '../Card';
import { IRoundProps } from './IRoundProps';
import { IRoundState} from './IRoundState';
import './Round.css';
import classNames from 'classnames/bind';
import { MqttClient } from 'mqtt';

export class Round extends Component<IRoundProps, IRoundState> {
    client: MqttClient = this.props.client;
    players: Player[] = this.props.players;
    cardStates: CardState[] = [];
    isJack: boolean = false;
    created: number = Date.now();
    playerTurn: number = 0;

    constructor(props: IRoundProps) {
        super(props);
        this.state = {
            gameStarted: false,
            gameOver: false,
            topCard: null,
            players: this.players,
        }

        this.handleStart = this.handleStart.bind(this);
        this.handleSlap = this.handleSlap.bind(this);
        this.dealInPlayers = this.dealInPlayers.bind(this);
    }

    componentDidMount() {
        this.initDeck();
    }

    handleGameOver() {
        // send event to mqtt
        this.setState({ gameOver : true });
    }

    handleSlap() {
        // send slap event to mqtt
        let { players, playerTurn, cardStates } = this;
        if (this.isJack) {
            let currentHand: CardState[] = players[playerTurn].hand;
            currentHand = this.shuffleDeck([...currentHand, ...cardStates]);
            if (currentHand.length === 52) {
                this.handleGameOver();
            } else {
                players[playerTurn].hand = currentHand;
                const topCard: CardState = players[playerTurn].hand[0];
                cardStates = [topCard];
                this.setState({
                    topCard: <Card cardState={topCard} onClick={this.handleSlap} />
                });
            }
        } else {
            console.log('jack has not been slappededed');
        }
    }

    handleFlip(player: Player) {
        if (!this.state.gameStarted) {
            alert(`If ya wanna play, start the game ${player.name}!`);
        }
        else if (player.equals(this.players[this.playerTurn])) {
            const topCard: CardState = player.hand[0];
            player.hand = player.hand.slice(1);
            this.isJack = topCard.value === 11;
            this.playerTurn = (this.playerTurn + 1) % this.players.length;
            this.cardStates.push(topCard);
            this.setState({
                topCard: <Card cardState={topCard} onClick={this.handleSlap}/>
            });
        } else alert(`Wait your turn, ${player.name} :)`);
    }

    handleStart() {
        this.setState({ gameStarted: true }, () => {
            this.dealInPlayers();
        });
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
        this.cardStates = this.shuffleDeck(cardStates);
    }
    
    dealInPlayers() {
        let startIdx: number = 0;
        const cardsPerPlayer: number = Math.floor(52/(this.players.length));
        let endIdx: number = cardsPerPlayer;
        let newStates: CardState[] = [];
        this.players.forEach((player, idx) => {
            player.hand = this.cardStates.slice(startIdx, idx === this.players.length - 1 ? 52 : endIdx);
            startIdx += cardsPerPlayer;
            endIdx += cardsPerPlayer;
            newStates = [...this.cardStates.slice(endIdx)];
        });

        this.cardStates = newStates;
        this.handleFlip(this.players[this.playerTurn]);
    }
    
    shuffleDeck(cardStates: CardState[]) {
        return cardStates.sort(() => Math.random() - 0.5);
    }

    renderGameOver() {
        const { players, playerTurn } = this;
        return (
            <div>
                <h1> Game over! {players[playerTurn].name} won!</h1>
            </div>
        );
    }

    renderGame() {
        const { players, playerTurn } = this;
        const { gameStarted, topCard } = this.state;
        return (
            <div>
                <h1>Players: {players.map(player=> `${player.name}\n`)}</h1>
                { !gameStarted && <button onClick={this.handleStart}>Start!</button> }
                <div className="card-table">
                    {topCard}
                </div>
                <div>
                { gameStarted && <h2>It's {players[playerTurn].name}'s turn</h2>}
                {players.map((player) => {
                    return (
                        <div className="player-zone" key={player.name}>
                            <Card cardState={new CardState(1,Suit.spades, false, false)} onClick={()=> {
                                this.handleFlip(player);
                            }}/>
                            <span className="hand-count">{`${player.name} \n ${player.hand.length}`}</span>
                        </div>
                    );
                })}
                </div>
            </div>
        )
    }

    render() {
        const { gameOver } = this.state;
        return (
        <div>
            { gameOver ? this.renderGameOver() : this.renderGame() }
        </div>
        );
    }
}