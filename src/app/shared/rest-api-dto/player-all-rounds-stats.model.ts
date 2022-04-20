import {Type} from "class-transformer";
import {RoundGroupScoreboardRow} from "./round-group-scoreboard-row.model";
import {PlayerSingleRoundsStats} from "./player-single-rounds-stats.model";
import {PlayersScoreboard} from "./players-scoreboard.model";

export class PlayerAllRoundsStats {
    @Type(() => PlayersScoreboard)
    public scoreboardRow: RoundGroupScoreboardRow;

    @Type(() => PlayerSingleRoundsStats)
    public playerSingleRoundStats: PlayerSingleRoundsStats[];
}
