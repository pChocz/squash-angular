import {Type} from 'class-transformer';
import {Match} from "./match.model";
import {Player} from "./player.model";
import {RoundGroupScoreboardRow} from "./round-group-scoreboard-row.model";
import {Round} from "./round.model";

export class PlayersEncounter {

    @Type(() => Round)
    public round: Round;

    @Type(() => Match)
    public directMatch: Match;

    public xpPointsDifference: number;
    public winningType: string;
    public winningDifference: number;

    @Type(() => RoundGroupScoreboardRow)
    public firstPlayerRow: RoundGroupScoreboardRow;

    @Type(() => RoundGroupScoreboardRow)
    public secondPlayerRow: RoundGroupScoreboardRow;

    @Type(() => Player)
    public winner: Player;

}
