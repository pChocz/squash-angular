import {Type} from "class-transformer";
import {Player} from "./player.model";

export class RoundOpponent {

    @Type(() => Player)
    public player: Player;

    public won: boolean;
    public placeInGroup: number;
}
