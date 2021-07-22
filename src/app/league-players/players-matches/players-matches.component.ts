import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {Match} from 'src/app/shared/rest-api-dto/match.model';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatchesPaginated} from '../../shared/rest-api-dto/matches-paginated.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, startWith, switchMap} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {merge} from 'rxjs';
import {ApiEndpointsService} from "../../shared/api-endpoints.service";

@Component({
    selector: 'app-players-matches',
    templateUrl: './players-matches.component.html',
    styleUrls: ['./players-matches.component.css'],
})
export class PlayersMatchesComponent implements AfterViewInit {

    displayedColumns: string[] = [
        'date-column',
        'first-player',
        'second-player',
        'first-set-first-player',
        'first-set-second-player',
        'second-set-first-player',
        'second-set-second-player',
        'third-set-first-player',
        'third-set-second-player',
        'fourth-set-first-player',
        'fourth-set-second-player',
        'fifth-set-first-player',
        'fifth-set-second-player'
    ];

    @Input() leagueUuid: string;
    @Input() seasonUuid: string;
    @Input() groupNumber: number;
    @Input() playersUuids: string[];
    @Input() additionalMatches: boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    matchesSimplePaginated: MatchesPaginated;
    dataSource: MatTableDataSource<Match>;
    resultsLength = 0;
    pageSize = 50;

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService) {

    }

    ngAfterViewInit(): void {
        merge(this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    let httpParams = this.prepareQueryParams();
                    if (this.additionalMatches) {
                        return this.http
                            .get<MatchesPaginated>(this.apiEndpointsService.getMatchesAdditionalForLeagueForPlayers(this.leagueUuid, this.playersUuids), {params: httpParams});
                    } else {
                        return this.http
                            .get<MatchesPaginated>(this.apiEndpointsService.getMatchesForLeagueForPlayers(this.leagueUuid, this.playersUuids), {params: httpParams});
                    }
                }),
                map((result) => {
                    this.resultsLength = result.total;
                    this.paginator.pageSizeOptions = [this.pageSize];
                    return plainToClass(MatchesPaginated, result);
                })
            )
            .subscribe((result) => {
                this.matchesSimplePaginated = result;
                this.dataSource = new MatTableDataSource<Match>(this.matchesSimplePaginated.matches);
            });
    }

    private prepareQueryParams() {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('size', String(this.pageSize));
        httpParams = httpParams.append('page', String(this.paginator.pageIndex));
        if (this.seasonUuid !== '0') {
            httpParams = httpParams.append('seasonUuid', this.seasonUuid);
        }
        if (this.groupNumber > 0) {
            httpParams = httpParams.append('groupNumber', String(this.groupNumber));
        }
        return httpParams;
    }

}
