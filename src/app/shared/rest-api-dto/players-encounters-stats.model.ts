import {Type} from 'class-transformer';
import {Player} from "./player.model";
import {PlayersEncounter} from "./players-encounter.model";

export class PlayersEncountersStats {

    @Type(() => Player)
    public firstPlayer: Player;

    @Type(() => Player)
    public secondPlayer: Player;

    @Type(() => PlayersEncounter)
    public playersEncounters: PlayersEncounter[];
}
