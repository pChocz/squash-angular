import {Type} from 'class-transformer';
import {LeaguePerSeasonStats} from './league-per-season-stats.model';
import {LeagueScoreboard} from './league-scoreboard.model';

export class LeagueDetailedStats {

    public leagueUuid: string;
    public leagueName: string;

    @Type(() => LeaguePerSeasonStats)
    public perSeasonStats: LeaguePerSeasonStats[];

    @Type(() => LeagueScoreboard)
    public scoreboard: LeagueScoreboard;

}
