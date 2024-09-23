import {Player} from './player.model';
import {Set} from './set.model';
import {Type} from 'class-transformer';
import {MatchScore} from "./match-score.model";
import {Audit} from "./audit.model";

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
    public footageLink: string

    @Type(() => Player)
    public firstPlayer: Player;

    @Type(() => Player)
    public secondPlayer: Player;

    @Type(() => Player)
    public winner: Player;

    @Type(() => Set)
    public sets: Set[];

    @Type(() => MatchScore)
    public matchScores: MatchScore[];

    @Type(() => Audit)
    public audit: Audit;

    getResult(): string {
        let resultAsString: string = this.firstPlayer.username + ' - ' + this.secondPlayer.username + ': ';
        this.sets.forEach((set) => {
            resultAsString += set.getScore() + ', ';
        });
        resultAsString = resultAsString.substring(0, resultAsString.length - 2);
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
        if (setIndex >= this.sets.length) {
            return false;
        }
        const set: Set = this.sets[setIndex];
        return set.firstPlayerScore > set.secondPlayerScore;
    }

    secondPlayerWinsSet(setIndex: number): boolean {
        if (setIndex >= this.sets.length) {
            return false;
        }
        const set: Set = this.sets[setIndex];
        return set.firstPlayerScore < set.secondPlayerScore;
    }

    hasSetOfNumber(number: number): boolean {
        if (this.sets.length < number) {
            return false;
        } else {
            return true;
        }
    }

    getLastMatchScore() {
        let length = this.matchScores.length;
        if (length === 0) {
            return undefined;
        }
        return this.matchScores[length - 1];
    }

    getLastMatchScoreStartingWith(startsWith: string) {
        let filtered = this
            .matchScores
            .filter(v => v.scoreEventType.startsWith(startsWith));

        return filtered.length === 0
            ? undefined
            : filtered[filtered.length - 1];
    }

    getGameWinner(gameNumber: number) {
        let gameEndsScore = this.matchScores.filter(v => v.scoreEventType === 'GAME_ENDS' && v.gameNumber === gameNumber);
        if (gameEndsScore.length === 0) {
            return '--';
        }

        let firstPlayerScore = this.sets[gameNumber - 1].firstPlayerScore;
        let secondPlayerScore = this.sets[gameNumber - 1].secondPlayerScore;

        if (firstPlayerScore > secondPlayerScore) {
            return this.firstPlayer.username;
        } else if (firstPlayerScore < secondPlayerScore) {
            return this.secondPlayer.username;
        } else {
            return '--';
        }
    }

    getMatchWinner() {
        let matchEndsScore = this.matchScores.filter(v => v.scoreEventType === 'MATCH_ENDS');
        if (matchEndsScore.length === 0) {
            return '--';
        }
        if (matchEndsScore[0].firstPlayerGamesWon > matchEndsScore[0].secondPlayerGamesWon) {
            return this.firstPlayer.username;
        } else if (matchEndsScore[0].firstPlayerGamesWon < matchEndsScore[0].secondPlayerGamesWon) {
            return this.secondPlayer.username;
        } else {
            return '--';
        }
    }

    getGameDuration(gameNumber: number) {
        let gameBeginsScore = this.matchScores.filter(v => v.scoreEventType === 'GAME_BEGINS' && v.gameNumber === gameNumber);
        let gameEndsScore = this.matchScores.filter(v => v.scoreEventType === 'GAME_ENDS' && v.gameNumber === gameNumber);
        if (gameBeginsScore[0] && gameEndsScore[0]) {
            return new Date(gameEndsScore[0].dateTime).getTime() - new Date(gameBeginsScore[0].dateTime).getTime();
        } else {
            return undefined;
        }
    }

    getMatchDuration() {
        let matchBeginsScore = this.matchScores.filter(v => v.scoreEventType === 'MATCH_BEGINS');
        let matchEndsScore = this.matchScores.filter(v => v.scoreEventType === 'MATCH_ENDS');
        if (matchBeginsScore[0] && matchEndsScore[0]) {
            return new Date(matchEndsScore[0].dateTime).getTime() - new Date(matchBeginsScore[0].dateTime).getTime();
        } else {
            return undefined;
        }
    }
}
