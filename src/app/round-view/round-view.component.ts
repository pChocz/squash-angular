import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Match } from '../shared/match.model';
import { RoundScoreboard } from './model/round-scoreboard.model';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-round-view',
  templateUrl: './round-view.component.html',
  styleUrls: ['./round-view.component.css']
})
export class RoundViewComponent implements OnInit {

  displayedColumns: string[] = [
    'first-player',
    'vsColumn',
    'second-player',
    'first-set-first-player',
    'first-set-second-player',
    'second-set-first-player',
    'second-set-second-player',
    'third-set-first-player',
    'third-set-second-player',
  ];

  roundScoreboard: RoundScoreboard;

  matches: Match[];
  uuid: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title) {

    route.params.subscribe(params => {
      this.setupComponent(params['uuid'])
    });

  }


  setupComponent(roundUuid: string) {
    this.uuid = roundUuid;

    this.http.get<RoundScoreboard>(environment.apiUrl + 'scoreboards/rounds/' + this.uuid)
      .pipe(
        map(result => plainToClass(RoundScoreboard, result)))
      .subscribe(result => {
        console.log(result);
        this.roundScoreboard = result

        this.titleService.setTitle("Round " + this.roundScoreboard.roundNumber + " | Season " + this.roundScoreboard.seasonNumber + " | " + this.roundScoreboard.leagueName);

        this.matches = result.roundGroupScoreboards[1].matches;
      });
  }


  ngOnInit(): void {

  }

  dateFormatted(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', 'en-US');
  }

}
