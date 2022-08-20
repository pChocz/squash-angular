import {Type} from "class-transformer";
import {Player} from "./player.model";
import {MatchResultCount} from "./match-result-count.model";

export class OpponentMatchResultDistribution {

    @Type(() => Player)
    public opponent: Player;

    public matchesWon: number;

    @Type(() => MatchResultCount)
    public matchResultCountList: MatchResultCount[];

}
