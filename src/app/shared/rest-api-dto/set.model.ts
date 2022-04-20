export class Set {

    public setNumber: number;
    public firstPlayerScore: number;
    public secondPlayerScore: number;

    public getScore() {
        if (this.firstPlayerScore != null && this.secondPlayerScore != null) {
            return this.firstPlayerScore + ':' + this.secondPlayerScore;
        } else {
            return '---- ';
        }
    }

    public hasResult() {
        return this.firstPlayerScore != null
            && this.secondPlayerScore != null
    }

}
