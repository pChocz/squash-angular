import {Type} from 'class-transformer';
import {XpPoints} from './xp-points.model';

export class XpPointsPerRound {

  public type: string;
  public split: string;
  public numberOfPlayers: number;

  @Type(() => XpPoints)
  public xpPoints: XpPoints[];
}
