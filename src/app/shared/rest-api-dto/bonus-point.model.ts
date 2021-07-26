import {Type} from 'class-transformer';
import {Player} from "./player.model";

export class BonusPoint {

  public uuid: string;

  @Type(() => Player)
  public winner: Player;

  @Type(() => Player)
  public looser: Player;

  public points: number;

  public date: Date;

  public toString(): string {
    return this.winner + ' - ' + this.looser + ' (' + this.points + ')';
  }

}
