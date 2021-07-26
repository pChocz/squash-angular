import {Type} from 'class-transformer';
import {RoundGroupScoreboardRow} from './round-group-scoreboard-row.model';
import {Match} from 'src/app/shared/rest-api-dto/match.model';

export class RoundGroupScoreboard {
  public roundGroupNumber: number;

  @Type(() => RoundGroupScoreboardRow)
  public scoreboardRows: RoundGroupScoreboardRow[];

  @Type(() => Match)
  public matches: Match[];

  public getNumberOfPlayers(): number {
    return this.scoreboardRows.length;
  }

}
