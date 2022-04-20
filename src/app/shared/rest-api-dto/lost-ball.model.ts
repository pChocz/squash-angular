import {Type} from 'class-transformer';
import {Player} from "./player.model";

export class LostBall {

    public uuid: string;

    @Type(() => Player)
    public player: Player;

    public count: number;

    public date: Date;

    public toString(): string {
        return this.player.toString();
    }

}
