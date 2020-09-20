import { Type } from 'class-transformer';
import { RoundGroupScoreboardRow } from 'src/app/round-view/model/round-group-scoreboard-row.model';
import { Match } from 'src/app/shared/match.model';

export class PlayersScoreboard {

  public numberOfMatches: number;
  public leagueName: string;
  public leagueLogo: string;

  @Type(() => RoundGroupScoreboardRow)
  public scoreboardRows: RoundGroupScoreboardRow[];

}
