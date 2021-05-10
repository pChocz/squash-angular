import { Player } from './player.model';
import { Set } from './set.model';
import { Type } from 'class-transformer';

export class Match {
    public matchUuid: string;
    public roundGroupNumber: number;
    public roundNumber: number;
    public roundUuid: number;
    public seasonNumber: number;
    public status: string;
    public date: Date;
    public type: string
    public leagueName: string
    public leagueUuid: string

    @Type(() => Player)
    public firstPlayer: Player;

    @Type(() => Player)
    public secondPlayer: Player;

    @Type(() => Set)
    public sets: Set[];

    getResult(): string {
        let resultAsString: string = this.firstPlayer.username + ' vs. ' + this.secondPlayer.username + ': [';
        this.sets.forEach((set) => {
            if (set.hasResult()) {
                resultAsString += set.getScore() + ' | ';
            }
        });
        resultAsString = resultAsString.substring(0, resultAsString.length - 3);
        resultAsString += ']';
        return resultAsString;
    }

    getResultOfSet(setNumber: number): string {
        return this.sets[setNumber - 1].firstPlayerScore + ' : ' + this.sets[setNumber - 1].secondPlayerScore;
    }

    firstPlayerWins(): boolean {
        const setsWon = this.calculateWonSets();
        return setsWon[0] > setsWon[1] && this.status === 'FINISHED';
    }

    secondPlayerWins(): boolean {
        const setsWon = this.calculateWonSets();
        return setsWon[0] < setsWon[1] && this.status === 'FINISHED';
    }

    calculateWonSets(): number[] {
        const numberOfSetsWon = [0, 0];
        this.sets.forEach((set) => {
            if (set.firstPlayerScore > set.secondPlayerScore) {
                numberOfSetsWon[0]++;
            } else if (set.firstPlayerScore < set.secondPlayerScore) {
                numberOfSetsWon[1]++;
            }
        });
        return numberOfSetsWon;
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
