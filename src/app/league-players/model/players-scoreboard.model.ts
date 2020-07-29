import { Type } from 'class-transformer';
import { RoundGroupScoreboardRow } from 'src/app/round-view/model/round-group-scoreboard-row.model';
import { Match } from 'src/app/shared/match.model';

export class PlayersScoreboard {

  public numberOfMatches: number;
  public leagueName: String;
  public leagueLogo: String;

  @Type(() => RoundGroupScoreboardRow)
  public scoreboardRows: RoundGroupScoreboardRow[];

  @Type(() => Match)
  public matches: Match[];

}
