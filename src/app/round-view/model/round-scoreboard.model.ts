import { Type } from 'class-transformer';
import { RoundGroupScoreboard } from './round-group-scoreboard.model';

export class RoundScoreboard {

  public leagueName: String;

  public seasonId: number;
  public seasonNumber: number; 

  public roundId: number;
  public roundNumber: number;
  public roundDate: Date;

  @Type(() => RoundGroupScoreboard)
  public roundGroupScoreboards: RoundGroupScoreboard[];

}
