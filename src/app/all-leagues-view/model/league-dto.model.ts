import { Type } from 'class-transformer';
import { SeasonDto } from './season-dto.model';

export class LeagueDto {

  public leagueId: number;
  public leagueName: String;
  public leagueLogo: String;

  @Type(() => SeasonDto)
  public seasons: SeasonDto[];

  public logoSanitized() : string {
    return  "data:Image/*;base64," + this.leagueLogo
  }

}
