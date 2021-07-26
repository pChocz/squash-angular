import {Player} from "./player.model";
import {Type} from "class-transformer";

export class Trophy {

  public trophy: string;

  @Type(() => Player)
  public player: Player;

}
