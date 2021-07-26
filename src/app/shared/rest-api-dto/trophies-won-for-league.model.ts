import {Type} from 'class-transformer';
import {Player} from "./player.model";
import {League} from "./league.model";
import {TrophiesWonForSeason} from "./trophies-won-for-season.model";

export class TrophiesWonForLeague {

  @Type(() => Player)
  public player: Player;

  @Type(() => League)
  public league: League;

  @Type(() => TrophiesWonForSeason)
  public trophiesPerSeason: TrophiesWonForSeason[]

}
