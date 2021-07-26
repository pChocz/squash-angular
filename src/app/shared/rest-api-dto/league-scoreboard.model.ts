import {Type} from 'class-transformer';
import {LeagueScoreboardRow} from './league-scoreboard-row.model';

export class LeagueScoreboard {
  public leagueName: string;
  public numberOfMatches: number;

  @Type(() => LeagueScoreboardRow)
  public rows: LeagueScoreboardRow[];
}
