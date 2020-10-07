export class Set {
    public setNumber: number;
    public firstPlayerScore: number;
    public secondPlayerScore: number;

    public getScore() {
        if (this.firstPlayerScore && this.secondPlayerScore) {
            return this.firstPlayerScore + ' : ' + this.secondPlayerScore;
        } else {
            return '----';
        }
    }
}
