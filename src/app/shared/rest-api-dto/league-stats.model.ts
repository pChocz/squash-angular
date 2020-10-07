import { Type } from 'class-transformer';
import { HallOfFame } from './hall-of-fame.model';
import { LeagueOveralStats } from './league-overal-stats.model';
import { LeaguePerSeasonStats } from './league-per-season-stats.model';
import { LeagueScoreboard } from './league-scoreboard.model';

export class LeagueStats {
    public leagueUuid: string;
    public leagueName: string;
    public logoBytes: string;

    @Type(() => HallOfFame)
    public hallOfFame: HallOfFame[];

    @Type(() => LeagueOveralStats)
    public overalStats: LeagueOveralStats;

    @Type(() => LeaguePerSeasonStats)
    public perSeasonStats: LeaguePerSeasonStats[];

    @Type(() => LeagueScoreboard)
    public scoreboard: LeagueScoreboard;

    public logoSanitized(): string {
        return 'data:Image/*;base64,' + this.logoBytes;
    }
}
