import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
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

@Component({
  selector: 'app-season-view',
  templateUrl: './season-view.component.html',
  styleUrls: ['./season-view.component.css']
})
export class SeasonViewComponent implements OnInit {

  displayedColumns: string[] = ['position', 'player', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'totalPoints', 'countedPoints', 'attendices', 'average', 'bonusPoints', 'countedPointsPretenders'];
  dataSource: MatTableDataSource<SeasonScoreboardRow>;
  uuid: string;

  seasonScoreboard: SeasonScoreboard;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title) {

      route.params.subscribe(params => {
        this.setupComponent(params['uuid'])
      });
  }

  setupComponent(seasonUuid: string) {
    this.uuid = seasonUuid;

    this.http.get<SeasonScoreboard>(environment.apiUrl + 'scoreboards/seasons/' + this.uuid)
      .pipe(
        map(result => plainToClass(SeasonScoreboard, result)))
      .subscribe(result => {
        console.log(result);
        this.seasonScoreboard = result
        this.titleService.setTitle("Season " + this.seasonScoreboard.season.seasonNumber + " | " + this.seasonScoreboard.season.leagueName);
        this.dataSource = new MatTableDataSource(this.seasonScoreboard.seasonScoreboardRows);
        // this.sort.sort(({ id: 'countedPoints', start: 'desc' }) as MatSortable);
        // console.log(this.sort)
        this.dataSource.sort = this.sort;
      });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {

  }

  // updateSeason(newUuid: string) {
  //   this.uuid = newUuid;

  //   this.http.get<SeasonScoreboard>(environment.apiUrl + 'scoreboards/seasons/' + this.uuid)
  //     .pipe(
  //       map(result => plainToClass(SeasonScoreboard, result)))
  //     .subscribe(result => {
  //       console.log(result);
  //       this.seasonScoreboard = result

  //       this.titleService.setTitle("Season " + this.seasonScoreboard.season.seasonNumber + " | " + this.seasonScoreboard.season.leagueName);

  //       this.dataSource = new MatTableDataSource(this.seasonScoreboard.seasonScoreboardRows);
  //       this.sort.sort(({ id: 'countedPoints', start: 'desc' }) as MatSortable);
  //       this.dataSource.sort = this.sort;

  //       console.log("dupa");
  //     });
  // }

  dateFormatted(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', 'en-US');
  }

}
