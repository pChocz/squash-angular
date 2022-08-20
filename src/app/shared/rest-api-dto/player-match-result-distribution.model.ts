import {Type} from "class-transformer";
import {Player} from "./player.model";
import {OpponentMatchResultDistribution} from "./opponent-match-result-distribution.model";

export class PlayerMatchResultDistribution {

    @Type(() => Player)
    public player: Player;

    public matchesWon: number;

    @Type(() => OpponentMatchResultDistribution)
    public opponentMatchResultDistributionList: OpponentMatchResultDistribution[];

    public findResultsForOpponent(opponent: Player): OpponentMatchResultDistribution {
        for (let opponentMatchResultDistribution of this.opponentMatchResultDistributionList) {
            if (opponentMatchResultDistribution.opponent.uuid === opponent.uuid) {
                return opponentMatchResultDistribution;
            }
        }
        return null;
    }

}
