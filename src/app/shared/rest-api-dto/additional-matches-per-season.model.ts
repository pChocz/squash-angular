import {Type} from "class-transformer";
import {Season} from "./season.model";

export class AdditionalMatchesPerSeason {
    @Type(() => Season)
    public season: Season;
    public numberOfAdditionalMatches: number;
}
