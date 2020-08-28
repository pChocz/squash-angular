import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatchService } from '../shared/match.service';
import { Match } from '../shared/match.model';
import { RoundScoreboard } from './model/round-scoreboard.model';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';
import { RoundGroupScoreboard } from './model/round-group-scoreboard.model';
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
    private router: Router,
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

  deleteRound(): void {
    let roundUuid: string = this.uuid;

    console.log("deleting round ID: " + roundUuid);




    this.http.delete(environment.apiUrl + 'rounds/' + roundUuid).subscribe(() => {

      console.log("deleted round!");
      // console.log("result should be empty: " + result);


      let seasonId: number = this.roundScoreboard.seasonId;
      this.router.navigate(['season-view', seasonId]);
    }

    );

  }

  updateRound(newUuid: string) {
    this.uuid = newUuid;

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

  dateFormatted(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', 'en-US');
  }

}
