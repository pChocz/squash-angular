import {Type} from 'class-transformer';
import {RoundGroupScoreboard} from './round-group-scoreboard.model';
import {Match} from 'src/app/shared/rest-api-dto/match.model';
import {Audit} from "./audit.model";

export class RoundScoreboard {
    public leagueName: string;
    public leagueUuid: string;

    public seasonUuid: string;
    public seasonNumber: number;
    public seasonNumberRoman: string;

    public roundUuid: string;
    public roundNumber: number;
    public roundDate: Date;

    public finishedState: boolean;

    @Type(() => RoundGroupScoreboard)
    public roundGroupScoreboards: RoundGroupScoreboard[];

    public numberOfAllMatches: number;
    public numberOfFinishedMatches: number;

    @Type(() => Audit)
    public audit: Audit;

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

    getNumberOfMatches(): number {
        let count = 0;
        for (const roundGroupScoreboard of this.roundGroupScoreboards) {
            count += roundGroupScoreboard.matches.length;
        }
        return count;
    }

    getNumberOfPlayers(): number {
        let count = 0;
        for (const roundGroupScoreboard of this.roundGroupScoreboards) {
            count += roundGroupScoreboard.scoreboardRows.length;
        }
        return count;
    }

    allMatchesEmpty(): boolean {
        for (const roundGroupScoreboard of this.roundGroupScoreboards) {
            for (const match of roundGroupScoreboard.matches) {
                for (const set of match.sets) {
                    if (set.firstPlayerScore || set.secondPlayerScore) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

}
