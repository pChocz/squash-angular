import {Season} from './season.model';
import {Type} from 'class-transformer';
import {SeasonScoreboardRow} from './season-scoreboard-row.model';
import {Round} from './round.model';
import {SeasonStar} from "./season-star.model";
import {Audit} from "./audit.model";

export class SeasonScoreboard {
    @Type(() => Season)
    public season: Season;

    public allRounds: number;
    public finishedRounds: number;
    public countedRounds: number;

    public xpPointsType: string;

    @Type(() => SeasonStar)
    public seasonStars: Map<string, SeasonStar>;

    @Type(() => SeasonScoreboardRow)
    public seasonScoreboardRows: SeasonScoreboardRow[];

    @Type(() => Round)
    public rounds: Round[];

    @Type(() => Audit)
    public audit: Audit;

    hasAnyLostBalls(): boolean {
        for (let row of this.seasonScoreboardRows) {
            if (row.lostBalls > 0) {
                return true;
            }
        }
        return false;
    }

}
