import { Type } from 'class-transformer';
import { RoundGroupScoreboardRow } from 'src/app/shared/rest-api-dto/round-group-scoreboard-row.model';
import {Match} from "./match.model";
import {HeadToHeadScoreboardRow} from "./head-to-head-scoreboard-row.model";
import {HeadToHeadChartData} from "./head-to-head-chart-data.model";

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

    @Type(() => HeadToHeadChartData)
    public chartData: HeadToHeadChartData;

}
