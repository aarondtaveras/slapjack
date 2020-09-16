import { MqttClient } from 'mqtt';
import { Player } from '../Player/Player';

export interface IRoundProps {
    players: Player[],
    client: MqttClient,
}