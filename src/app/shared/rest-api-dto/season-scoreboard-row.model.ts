import {Player} from 'src/app/shared/rest-api-dto/player.model';
import {Type} from 'class-transformer';
import {RoundAndGroupPosition} from "./round-and-group-position.model";

export class SeasonScoreboardRow {
  @Type(() => Player)
  public player: Player;

  public bonusPoints: number;
  public average: number;
  public attendices: number;
  public totalPoints: number;
  public countedPoints: number;
  public countedPointsPretenders: number;

  @Type(() => RoundAndGroupPosition)
  public roundNumberToXpMapAll: Map<number, RoundAndGroupPosition>;
  public roundNumberToXpMapPretenders: Map<number, number>;

  public pointsWon: number;
  public pointsLost: number;
  public pointsBalance: number;

  public setsWon: number;
  public setsLost: number;
  public setsBalance: number;

  public matchesWon: number;
  public matchesLost: number;
  public matchesBalance: number;

  constructor(player: Player) {
    this.player = player;
  }
}
