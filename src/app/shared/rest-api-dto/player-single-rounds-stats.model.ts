import {Type} from "class-transformer";
import {RoundOpponent} from "./round-opponent.model";
import {Round} from "./round.model";
import {RoundGroupScoreboardRow} from "./round-group-scoreboard-row.model";

export class PlayerSingleRoundsStats {

  public seasonNumber: number;

  public roundGroupNumber: number;
  public roundGroupCharacter: string;

  public split: string;

  @Type(() => Round)
  public round: Round;

  @Type(() => RoundGroupScoreboardRow)
  public row: RoundGroupScoreboardRow;

  @Type(() => RoundOpponent)
  public roundOpponents: RoundOpponent[];
}
