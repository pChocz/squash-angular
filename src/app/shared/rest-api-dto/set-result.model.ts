import {SetResultCount} from "./set-result-count.model";

export class SetResult {

    public first: number;
    public second: number;
    public greatest: number;
    public diff: number;
    public result: string;


    constructor(first: number, second: number, greatest: number) {
        this.first = first;
        this.second = second;
        this.greatest = greatest;
    }

}
