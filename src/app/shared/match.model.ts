import { Player } from './player.model';
import { Set } from './set.model';
import { Type } from "class-transformer";

export class Match {

    public matchId: number;

    public roundGroupId: number;

    public roundGroupNumber: number;

    public roundId: number;

    public roundNumber: number;

    public seasonId: number;

    public seasonNumber: number;

    @Type(() => Player)
    public firstPlayer: Player;

    @Type(() => Player)
    public secondPlayer: Player;

    @Type(() => Set)
    public sets: Set[]

    getResultOfSet(setNumber: number): String {
        return this.sets[setNumber - 1].firstPlayerScore + " : " + this.sets[setNumber - 1].secondPlayerScore;
    }

    firstPlayerWins() : boolean {
        let firstWonSets : number = 0;
        let secondWonSets : number = 0;
        this.sets.forEach(set => {
            if (set.firstPlayerScore > set.secondPlayerScore) {
                firstWonSets++;
            } else if (set.firstPlayerScore < set.secondPlayerScore) {
                secondWonSets++;
            }
        });

        if (firstWonSets > secondWonSets) {
            return true;
        } else {
            return false;
        }
    }

    secondPlayerWins() : boolean {
        let firstWonSets : number = 0;
        let secondWonSets : number = 0;
        this.sets.forEach(set => {
            if (set.firstPlayerScore > set.secondPlayerScore) {
                firstWonSets++;
            } else if (set.firstPlayerScore < set.secondPlayerScore) {
                secondWonSets++;
            }
        });

        if (firstWonSets < secondWonSets) {
            return true;
        } else {
            return false;
        }
    }

}

