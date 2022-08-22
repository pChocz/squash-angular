import {Type} from "class-transformer";
import {League} from "./league.model";
import {PlayerMatchResultDistribution} from "./player-match-result-distribution.model";

export class LeagueMatchResultDistribution {

    @Type(() => League)
    public league: League;

    public allMatches: number;

    @Type(() => PlayerMatchResultDistribution)
    public playerMatchResultDistributionList: PlayerMatchResultDistribution[];

}
