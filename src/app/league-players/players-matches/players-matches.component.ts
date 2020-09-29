import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Match } from 'src/app/shared/match.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { MatchesSimplePaginated } from '../model/matches-simple-paginated';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, startWith, switchMap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { merge } from 'rxjs';

@Component({
  selector: 'app-players-matches',
  templateUrl: './players-matches.component.html',
  styleUrls: ['./players-matches.component.css']
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
  @Input() commaSeparatedPlayersIds: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  matchesSimplePaginated: MatchesSimplePaginated;
  dataSource: MatTableDataSource<Match>;
  resultsLength: number = 0;
  pageSize: number = 50;

  constructor(
    private http: HttpClient) {

  }

  ngAfterViewInit(): void {

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.http.get<MatchesSimplePaginated>(this.buildPaginationLink(this.paginator.pageIndex));
        }),
        map(result => {
          this.resultsLength = result.total;
          this.paginator.pageSizeOptions = [this.pageSize];
          return plainToClass(MatchesSimplePaginated, result);
        }))
      .subscribe((result) => {
        this.matchesSimplePaginated = result;
        this.dataSource = new MatTableDataSource<Match>(this.matchesSimplePaginated.matches);
      });

  }

  buildPaginationLink(pageNumber: number): string {
    return environment.apiUrl
      + 'matches/pageable/leagues/'
      + this.leagueUuid + '/players/'
      + this.commaSeparatedPlayersIds
      + "?size=" + this.pageSize + "&page=" + pageNumber;
  }

  dateFormatted(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', 'en-US');
  }

}
