import { Player } from 'src/app/shared/rest-api-dto/player.model';
import { Type } from 'class-transformer';

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

    public matchesBalanceSigned(): string {
        if (this.matchesBalance > 0) {
            return '(+' + this.matchesBalance + ')';
        } else {
            return '(' + this.matchesBalance + ')';
        }
    }

    public setsBalanceSigned(): string {
        if (this.setsBalance > 0) {
            return '(+' + this.setsBalance + ')';
        } else {
            return '(' + this.setsBalance + ')';
        }
    }

    public pointsBalanceSigned(): string {
        if (this.pointsBalance > 0) {
            return '(+' + this.pointsBalance + ')';
        } else {
            return '(' + this.pointsBalance + ')';
        }
    }
}
