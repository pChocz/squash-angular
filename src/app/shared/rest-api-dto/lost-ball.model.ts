import {Type} from 'class-transformer';
import {Player} from "./player.model";
import {Audit} from "./audit.model";

export class LostBall {

    public uuid: string;

    @Type(() => Player)
    public player: Player;

    public count: number;

    public date: Date;

    @Type(() => Audit)
    public audit: Audit;

    public toString(): string {
        return this.player.toString();
    }

}
