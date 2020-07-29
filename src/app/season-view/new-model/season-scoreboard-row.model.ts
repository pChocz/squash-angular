import { Player } from 'src/app/shared/player.model';
import { Type } from 'class-transformer';

export class SeasonScoreboardRow {

  @Type(() => Player)
  public player: Player

  public bonusPoints: number;
  public average: number;
  public attendices: number;
  public totalPoints: number;
  public countedPoints: number;
  public countedPointsPretenders: number;
  public eightBestPoints: number;

  public roundNumberToXpMapAll: Map<number, number>;
  public roundNumberToXpMapPretenders: Map<number, number>;

}
