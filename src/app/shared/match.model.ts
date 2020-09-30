import { Player } from './player.model';
import { Set } from './set.model';
import { Type } from 'class-transformer';

export class Match {
    public matchId: number;
    public roundGroupId: number;
    public roundGroupNumber: number;
    public roundId: number;
    public roundNumber: number;
    public seasonId: number;
    public seasonNumber: number;
    public status: string;

    @Type(() => Player)
    public firstPlayer: Player;

    @Type(() => Player)
    public secondPlayer: Player;

    @Type(() => Set)
    public sets: Set[];

    getResult(): string {
        let resultAsString: string = this.firstPlayer.username + ' vs. ' + this.secondPlayer.username + ': [ ';
        this.sets.forEach((set) => {
            resultAsString += set.getScore() + ' | ';
        });
        resultAsString = resultAsString.substring(0, resultAsString.length - 2);
        resultAsString += ']';
        resultAsString += ' ' + this.status;
        return resultAsString;
    }

    getResultOfSet(setNumber: number): string {
        return this.sets[setNumber - 1].firstPlayerScore + ' : ' + this.sets[setNumber - 1].secondPlayerScore;
    }

    firstPlayerWins(): boolean {
        let firstWonSets = 0;
        let secondWonSets = 0;
        this.sets.forEach((set) => {
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

    secondPlayerWins(): boolean {
        let firstWonSets = 0;
        let secondWonSets = 0;
        this.sets.forEach((set) => {
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

    firstPlayerWinsSet(setIndex: number): boolean {
        const set: Set = this.sets[setIndex];
        return set.firstPlayerScore > set.secondPlayerScore;
    }

    secondPlayerWinsSet(setIndex: number): boolean {
        const set: Set = this.sets[setIndex];
        return set.firstPlayerScore < set.secondPlayerScore;
    }

    hasThirdSet(): boolean {
        return this.sets[2].firstPlayerScore > 0 || this.sets[2].secondPlayerScore > 0;
    }
}
