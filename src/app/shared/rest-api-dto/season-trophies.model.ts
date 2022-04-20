import {Type} from "class-transformer";
import {Trophy} from "./trophy.model";
import {Player} from "./player.model";

export class SeasonTrophies {

    public seasonNumber: number;

    @Type(() => Trophy)
    public trophies: Trophy[];

    findAllPlayersForTrophy(trophyType: string): Player[] {
        return this
            .trophies
            .filter(trophy => trophy.trophy === trophyType)
            .map(trophy => trophy.player);
    }

    findPlayerForTrophy(trophyType: string): Player {
        let trophyFound = this
            .trophies
            .find(trophy => trophy.trophy === trophyType);

        if (trophyFound) {
            return trophyFound.player;

        } else {
            return null;
        }
    }

    findPlayerForTrophyWithEmoji(trophyType: string): string {
        let trophyFound = this
            .trophies
            .find(trophy => trophy.trophy === trophyType);

        if (trophyFound) {
            return trophyFound.player.emoji + trophyFound.player.username;

        } else {
            return null;
        }
    }

}
