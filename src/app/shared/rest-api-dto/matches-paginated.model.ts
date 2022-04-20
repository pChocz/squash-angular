import {Type} from 'class-transformer';
import {Match} from 'src/app/shared/rest-api-dto/match.model';

export class MatchesPaginated {
    public size: number;
    public total: number;
    public page: number;
    public pages: number;
    public min: number;
    public max: number;

    @Type(() => Match)
    public matches: Match[];
}
