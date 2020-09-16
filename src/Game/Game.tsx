import React, { Component } from 'react';
import { IGameProps, IGameState, Topic } from './';
import { Suit, Card, CardState } from '../Card';
import { Player } from '../Player/Player';
import { Round } from '../Round/Round';
import { connect, MqttClient } from 'mqtt';

export class Game extends Component<IGameProps, IGameState> {
  round: Round;
  players: Player[];
  topic: Topic;
  client: MqttClient;

  constructor(props: IGameProps) {
    super(props);
    const baseTopic: string = "slapjack/1234";
    this.topic = new Topic(baseTopic);
    this.players = [];

    const mqttUrl: string = "ws://40.76.170.92/";
    const port: number = 80;
    console.log("connecting to " + mqttUrl + ":" + port.toString());
    this.client = connect(mqttUrl, {"port": port});
    this.round = new Round({
      client: this.client,
      players: this.players
    });
  }

  handleNewPlayer = (topic: string, message: string) => {
    console.log("handle new player");
    this.round.players = [new Player("aaron")];
    this.client.publish(this.topic.oldPlayers, JSON.stringify(new Player("aaron")));
  }

  handleOldPlayers = (topic: string, message: string) => {
    const parsed: Player = JSON.parse(message);
    const oldPlayer: Player = new Player(parsed.name);
    oldPlayer.created = parsed.created;
    for (let i = 0; i < this.round.players.length; i++) {
      if (this.round.players[i].equals(oldPlayer)) {
        return;
      }
    }
    this.round.addPlayer(oldPlayer);
    console.log("setting state");
    this.setState({});
  }

  private connectMqtt(baseTopic: string) {
    this.client.subscribe(this.topic.baseTopic);
    this.client.subscribe(this.topic.joinGame);
    this.client.subscribe(this.topic.oldPlayers);
    this.client.on("message", (topic: string, message: Buffer) => {
      switch (topic) {
        case this.topic.joinGame:
          this.handleNewPlayer(topic, message.toString());
          break;
        case this.topic.oldPlayers:
          this.handleOldPlayers(topic, message.toString());
          break;
      }
    })
  }

  componentDidMount() {
    this.connectMqtt(this.topic.baseTopic);
    this.client.publish(this.topic.joinGame, JSON.stringify("aaron"));
    this.client.publish(this.topic.joinGame, JSON.stringify("dan"));
  }

  render() {
    return (
      <div className="game-container">
        <Round client={this.client} players={[new Player("aaron"), new Player("dan")]} />
      </div>
    );
  }
}
