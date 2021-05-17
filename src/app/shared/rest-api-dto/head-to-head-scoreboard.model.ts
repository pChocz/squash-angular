import {Type} from 'class-transformer';
import {Match} from "./match.model";
import {HeadToHeadScoreboardRow} from "./head-to-head-scoreboard-row.model";
import {HeadToHeadChartRow} from "./head-to-head-chart-row.model";

export class HeadToHeadScoreboard {

    public numberOfMatches: number;
    public numberOfRegularMatches: number;
    public numberOfTiebreaks: number;

    @Type(() => HeadToHeadScoreboardRow)
    public winner: HeadToHeadScoreboardRow;

    @Type(() => HeadToHeadScoreboardRow)
    public looser: HeadToHeadScoreboardRow;

    @Type(() => Match)
    public matches: Match[];

    @Type(() => HeadToHeadChartRow)
    public chartRows: HeadToHeadChartRow[];

}
