import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SeasonScoreboard } from './new-model/season-scoreboard.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { SeasonScoreboardRow } from './new-model/season-scoreboard-row.model';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-season-view',
  templateUrl: './season-view.component.html',
  styleUrls: ['./season-view.component.css']
})
export class SeasonViewComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  destroy$: Subject<boolean> = new Subject<boolean>();

  displayedColumns: string[] = [
    'position',
    'player',
    'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10',
    'totalPoints',
    'countedPoints',
    'attendices',
    'average',
    'bonusPoints',
    'countedPointsPretenders'
  ];

  dataSource: MatTableDataSource<SeasonScoreboardRow>;
  uuid: string;
  seasonScoreboard: SeasonScoreboard;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title) {

  }

  setupComponent(seasonUuid: string) {
    this.seasonScoreboard = null;
    this.uuid = seasonUuid;

    this.http.get<SeasonScoreboard>(environment.apiUrl + 'scoreboards/seasons/' + this.uuid)
      .pipe(
        map(result => plainToClass(SeasonScoreboard, result)))
      .subscribe(result => {
        this.seasonScoreboard = result
        this.titleService.setTitle("Season " + this.seasonScoreboard.season.seasonNumber + " | " + this.seasonScoreboard.season.leagueName);
        this.dataSource = new MatTableDataSource(this.seasonScoreboard.seasonScoreboardRows);
        this.dataSource.sort = this.sort;
      });
  }

  dateFormatted(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', 'en-US');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.setupComponent(params['uuid'])
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
