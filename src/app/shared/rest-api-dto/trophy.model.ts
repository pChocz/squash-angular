import {Player} from "./player.model";
import {Type} from "class-transformer";
import {Audit} from "./audit.model";

export class Trophy {

    public trophy: string;

    @Type(() => Player)
    public player: Player;

    @Type(() => Audit)
    public audit: Audit;
}
