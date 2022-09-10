export class MatchScore {

    gameNumber: number;
    datetime: Date;
    zonedDateTime: Date;
    scoreEventType: string;
    appealDecision: string;
    serveSide: string;
    servePlayer: string;
    firstPlayerScore: number;
    secondPlayerScore: number;
    firstPlayerScored: boolean;
    secondPlayerScored: boolean;
    nextSuggestedServeSide: string;
    nextSuggestedServePlayer: string;
    rally: boolean;
    firstPlayerGamesWon: number;
    secondPlayerGamesWon: number;
    canScore: boolean;
    canStartGame: boolean;
    canEndGame: boolean;
    canEndMatch: boolean;
    matchFinished: boolean;

    getResult() {
        return this.firstPlayerScore + ':' + this.secondPlayerScore;
    }

    getMatchResult() {
        return this.firstPlayerGamesWon + ':' + this.secondPlayerGamesWon;
    }
}
