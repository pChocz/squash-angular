import {Player} from "./player.model";
import {Type} from "class-transformer";
import {SetResultCount} from "./set-result-count.model";
import {SetResult} from "./set-result.model";

export class SetResultPlayer {

    @Type(() => Player)
    public player: Player;

    @Type(() => SetResultCount)
    public setResultCounts: SetResultCount[];

    public getCountForResult(setResult: SetResult): number {
        for (let setResultCount of this.setResultCounts) {
            if (setResultCount.first === setResult.first && setResultCount.second === setResult.second) {
                return setResultCount.count;
            }
        }
        return null;
    }

    public getCountForResultAsString(setResult: string): number {
        let colonIndex = setResult.indexOf(':');
        let first = parseInt(setResult.substring(0, colonIndex));
        let second = parseInt(setResult.substring(colonIndex + 1));

        for (let setResultCount of this.setResultCounts) {
            if (setResultCount.first === first && setResultCount.second === second) {
                return setResultCount.count;
            }
        }
        return null;
    }

}
