import { Type } from 'class-transformer';
import { RoundGroupScoreboardRow } from 'src/app/shared/rest-api-dto/round-group-scoreboard-row.model';

export class PlayersScoreboard {
    public numberOfMatches: number;
    public leagueName: string;
    public leagueLogo: string;

    @Type(() => RoundGroupScoreboardRow)
    public scoreboardRows: RoundGroupScoreboardRow[];
}
