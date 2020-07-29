import { Player } from 'src/app/shared/player.model';
import { Type } from 'class-transformer';
import { RoundGroupScoreboardRow } from './round-group-scoreboard-row.model';
import { Match } from 'src/app/shared/match.model';

export class RoundGroupScoreboard {

  public roundGroupNumber: number;

  @Type(() => RoundGroupScoreboardRow)
  public scoreboardRows: RoundGroupScoreboardRow[];

  @Type(() => Match)
  public matches: Match[];

  public getNumberOfPlayers() : number {
    return this.scoreboardRows.length;
  }

  public getGroupNumberNumeral() : String {
    switch(this.roundGroupNumber) {
      case 1:
        return "1st Group";
      case 2:
        return "2nd Group";
      case 3:
        return "3rd Group";
      default:
        return this.roundGroupNumber + "th Group";
    }
  }

}
