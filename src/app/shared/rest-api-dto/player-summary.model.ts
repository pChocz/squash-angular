import {Type} from 'class-transformer';
import {LeagueScoreboardRow} from "./league-scoreboard-row.model";

export class PlayerSummary {

  @Type(() => LeagueScoreboardRow)
  public scoreboardRow: LeagueScoreboardRow;

  public leagues: number;
  public seasons: number;
  public rounds: number;

}
