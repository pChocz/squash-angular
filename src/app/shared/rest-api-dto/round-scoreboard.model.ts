import { Type } from 'class-transformer';
import { RoundGroupScoreboard } from './round-group-scoreboard.model';
import { Match } from 'src/app/shared/rest-api-dto/match.model';

export class RoundScoreboard {
    public leagueName: string;

    public seasonId: number;
    public seasonUuid: string;
    public seasonNumber: number;
    public seasonNumberRoman: string;

    public roundId: number;
    public roundUuid: string;
    public roundNumber: number;
    public roundDate: Date;

    public finishedState: boolean;

    public previousRoundUuid: string;
    public nextRoundUuid: string;

    @Type(() => RoundGroupScoreboard)
    public roundGroupScoreboards: RoundGroupScoreboard[];

    findMatchByUuid(matchUuid: string): Match {
        for (const roundGroupScoreboard of this.roundGroupScoreboards) {
            for (const match of roundGroupScoreboard.matches) {
                if (match.matchUuid === matchUuid) {
                    return match;
                }
            }
        }
        return null;
    }
}
