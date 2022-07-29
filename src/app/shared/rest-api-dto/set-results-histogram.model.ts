import {Type} from "class-transformer";
import {Player} from "./player.model";
import {SetResult} from "./set-result.model";
import {SetResultPlayer} from "./set-result-player.model";
import {League} from "./league.model";

export class SetResultsHistogram {

    @Type(() => Player)
    public league: League;

    @Type(() => SetResultPlayer)
    public setResultsPlayers: SetResultPlayer[];

    @Type(() => SetResult)
    public uniqueResults: SetResult[];

}
