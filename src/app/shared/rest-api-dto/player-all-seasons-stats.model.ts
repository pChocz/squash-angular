import {Type} from "class-transformer";
import {PlayerSingleSeasonStats} from "./player-single-season-stats.model";
import {Player} from "./player.model";
import {SeasonTrophies} from "./season-trophies.model";

export class PlayerAllSeasonsStats {

    @Type(() => Player)
    public player: Player;

    @Type(() => PlayerSingleSeasonStats)
    public playerSingleSeasonStats: PlayerSingleSeasonStats[];

    @Type(() => SeasonTrophies)
    public seasonTrophies: SeasonTrophies[];
}
