import { Player } from 'src/app/shared/rest-api-dto/player.model';
import { Type } from 'class-transformer';

export class HeadToHeadScoreboardRow {

    @Type(() => Player)
    public player: Player;

    public pointsWon: number;
    public pointsLost: number;
    public pointsRatio: number;

    public setsWon: number;
    public setsLost: number;
    public setsRatio: number;

    public matchesWon: number;
    public matchesLost: number;
    public matchesRatio: number;

    public firstSetsWon: number;
    public firstSetsLost: number;
    public firstSetsRatio: number;

    public secondSetsWon: number;
    public secondSetsLost: number;
    public secondSetsRatio: number;

    public tieBreaksWon: number;
    public tieBreaksLost: number;
    public tieBreaksRatio: number;

    public regularMatchesWon: number;
    public regularMatchesLost: number;
    public regularMatchesRatio: number;

    public tieBreakMatchesWon: number;
    public tieBreakMatchesLost: number;
    public tieBreakMatchesRatio: number;

}
