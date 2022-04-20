import {Type} from "class-transformer";
import {Season} from "./season.model";
import {SeasonScoreboardRow} from "./season-scoreboard-row.model";

export class PlayerSingleSeasonStats {

    public placeInSeason: number;

    @Type(() => Season)
    public season: Season;

    @Type(() => SeasonScoreboardRow)
    public seasonScoreboardRow: SeasonScoreboardRow;
}
