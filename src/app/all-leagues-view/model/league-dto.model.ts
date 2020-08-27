import { Type } from 'class-transformer';
import { SeasonDto } from './season-dto.model';

export class LeagueDto {

  public leagueId: number;
  public leagueUuid: string;
  public leagueName: string;
  public leagueLogo: string;

  @Type(() => SeasonDto)
  public seasons: SeasonDto[];

  public logoSanitized() : string {
    return  "data:Image/*;base64," + this.leagueLogo
  }

}
