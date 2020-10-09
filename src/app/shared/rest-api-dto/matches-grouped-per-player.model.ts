import { Type } from 'class-transformer';
import { Player } from './player.model';

export class MatchesGroupedPerPlayer {
    public matches: number;

    @Type(() => Player)
    public player: Player;
}
