import { Type } from 'class-transformer';
import { RoundGroupScoreboardRow } from 'src/app/shared/rest-api-dto/round-group-scoreboard-row.model';
import {Match} from "./match.model";
import {HeadToHeadScoreboardRow} from "./head-to-head-scoreboard-row.model";

export class HeadToHeadScoreboard {

    public numberOfMatches: number;

    @Type(() => HeadToHeadScoreboardRow)
    public winner: HeadToHeadScoreboardRow;

    @Type(() => HeadToHeadScoreboardRow)
    public looser: HeadToHeadScoreboardRow;

    @Type(() => Match)
    public matches: Match[];

}
