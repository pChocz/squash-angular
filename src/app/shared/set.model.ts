
export class Set {

    public setNumber: number;
    public firstPlayerScore: number;
    public secondPlayerScore: number;

    public getScore() {
        if (this.firstPlayerScore == 0 && this.secondPlayerScore == 0) {
            return this.firstPlayerScore + " : " + this.secondPlayerScore;
        } else {
            return "";
        }
    }

}
