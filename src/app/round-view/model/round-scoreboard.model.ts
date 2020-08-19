import { Type } from 'class-transformer';
import { RoundGroupScoreboard } from './round-group-scoreboard.model';
import { Match } from 'src/app/shared/match.model';

export class RoundScoreboard {

  public leagueName: String;

  public seasonId: number;
  public seasonNumber: number;

  public roundId: number;
  public roundNumber: number;
  public roundDate: Date;

  @Type(() => RoundGroupScoreboard)
  public roundGroupScoreboards: RoundGroupScoreboard[];

  findMatchById(matchId: number): Match {

    for (let roundGroupScoreboard of this.roundGroupScoreboards) {
      for (let match of roundGroupScoreboard.matches) {
        if (match.matchId === matchId) {
          return match;
        }
      }
    }
    return null;

  }

}
