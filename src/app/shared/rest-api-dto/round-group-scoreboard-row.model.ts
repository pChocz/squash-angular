import {Player} from 'src/app/shared/rest-api-dto/player.model';
import {Type} from 'class-transformer';

export class RoundGroupScoreboardRow {
    @Type(() => Player)
    public player: Player;

    public pointsWon: number;
    public pointsLost: number;
    public pointsBalance: number;
    public pointsPlayed: number;

    public setsWon: number;
    public setsLost: number;
    public setsBalance: number;
    public setsPlayed: number;

    public matchesWon: number;
    public matchesLost: number;
    public matchesBalance: number;
    public matchesPlayed: number;

    public xpEarned: number;
    public placeInRound: number;
    public placeInGroup: number;

}
