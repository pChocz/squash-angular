import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Match } from 'src/app/shared/rest-api-dto/match.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { MatchesPaginated } from '../../shared/rest-api-dto/matches-paginated.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, startWith, switchMap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { merge } from 'rxjs';

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
    ];

    @Input() leagueUuid: string;
    @Input() seasonUuid: string;
    @Input() groupNumber: number;
    @Input() playersUuids: string[];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    matchesSimplePaginated: MatchesPaginated;
    dataSource: MatTableDataSource<Match>;
    resultsLength = 0;
    pageSize = 50;

    constructor(private http: HttpClient) {}

    ngAfterViewInit(): void {
        merge(this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {
                    let httpParams = this.prepareQueryParams();
                    let link = this.buildPaginationLink();
                    return this.http.get<MatchesPaginated>(link, { params: httpParams });
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

    buildPaginationLink(): string {
        return (
            environment.apiUrl +
            'matches/pageable/leagues/' +
            this.leagueUuid +
            '/players/' +
            this.playersUuids
        );
    }

    dateFormatted(date: Date): string {
        return formatDate(date, 'dd.MM.yyyy', 'en-US');
    }
}
