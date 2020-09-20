import { Type } from 'class-transformer';
import { Match } from 'src/app/shared/match.model';

export class MatchesSimplePaginated {

  public size: number;
  public total: number;

  public page: number;
  public pages: number;
  
  public min: number;
  public max: number;

  @Type(() => Match)
  public matches: Match[];

}
