import { Type } from 'class-transformer';
import { HallOfFameDto } from './hall-of-fame-dto.model';
import { LeagueOveralStatsDto } from './league-overal-stats-dto.model';
import { LeaguePerSeasonStatsDto } from './league-per-season-stats-dto.model';
import { LeagueScoreboard } from './league-scoreboard.model';

export class LeagueStatsDto {

  public leagueName: string;
  public logoBytes: string;

  @Type(() => HallOfFameDto)
  public hallOfFame: HallOfFameDto[];

  @Type(() => LeagueOveralStatsDto)
  public overalStats: LeagueOveralStatsDto;

  @Type(() => LeaguePerSeasonStatsDto)
  public perSeasonStats: LeaguePerSeasonStatsDto[];

  @Type(() => LeagueScoreboard)
  public scoreboard: LeagueScoreboard;


  public logoSanitized(): string {
    return "data:Image/*;base64," + this.logoBytes;
  }

}
