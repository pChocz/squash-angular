import {Type} from "class-transformer";
import {MatchResult} from "./match-result.model";

export class MatchResultCount {

    @Type(() => MatchResult)
    public matchResult: MatchResult;

    public matchesWon: number;

}
