import { Player } from 'src/app/shared/rest-api-dto/player.model';
import { Type } from 'class-transformer';

export class LeagueScoreboardRow {
    @Type(() => Player)
    public player: Player;

    public xpTotal: number;
    public xpCounted: number;
    public average: number;
    public attendices: number;

    public pointsWon: number;
    public pointsLost: number;
    public pointsBalance: number;

    public setsWon: number;
    public setsLost: number;
    public setsBalance: number;

    public matchesWon: number;
    public matchesLost: number;
    public matchesBalance: number;

}
