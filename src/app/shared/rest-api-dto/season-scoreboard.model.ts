import {Season} from './season.model';
import {Type} from 'class-transformer';
import {SeasonScoreboardRow} from './season-scoreboard-row.model';
import {Round} from './round.model';
import {SeasonStar} from "./season-star.model";

export class SeasonScoreboard {
  @Type(() => Season)
  public season: Season;

  public allRounds: number;
  public finishedRounds: number;
  public countedRounds: number;

  public xpPointsType: string;

  public previousSeasonUuid: string;
  public nextSeasonUuid: string;

  @Type(() => SeasonStar)
  public seasonStars: Map<string, SeasonStar>;

  @Type(() => SeasonScoreboardRow)
  public seasonScoreboardRows: SeasonScoreboardRow[];

  @Type(() => Round)
  public rounds: Round[];
}
