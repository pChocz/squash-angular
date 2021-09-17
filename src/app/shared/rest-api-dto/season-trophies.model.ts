import {Type} from "class-transformer";
import {Trophy} from "./trophy.model";
import {Player} from "./player.model";

export class SeasonTrophies {

  public seasonNumber: number;

  @Type(() => Trophy)
  public trophies: Trophy[];

  findPlayerForTrophy(trophyType: string): string {
    let trophyFound = this
    .trophies
    .find(trophy => trophy.trophy === trophyType);

    if (trophyFound) {
      return trophyFound.player.emoji + trophyFound.player.username;

    } else {
      return null;
    }
  }

}
