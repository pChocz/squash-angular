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
  uid: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private titleService: Title) {


    this.route.params.subscribe(params => this.uid = params["uid"]);


    this.http.get<RoundScoreboard>('http://localhost:8080/scoreboards/rounds/' + this.uid)
      .pipe(
        map(result => plainToClass(RoundScoreboard, result)))
      .subscribe(result => {
        console.log(result);
        this.roundScoreboard = result

        this.titleService.setTitle("Round " + this.roundScoreboard.roundNumber + " | Season " + this.roundScoreboard.seasonNumber + " | " + this.roundScoreboard.leagueName);


        // let numberOfGroups: number = this.roundScoreboard.roundGroupScoreboards.length;

        // for (let i: number = 0; i < numberOfGroups; i++) {
        //   let roundGroupScoreboard: RoundGroupScoreboard = this.roundScoreboard.roundGroupScoreboards[i];

        //   let groupNumber = i+1;
        //   let numberOfPlayers = roundGroupScoreboard.getNumberOfPlayers();

        //   console.log("group:   " + groupNumber);
        //   console.log("players: " + numberOfPlayers);
        //   console.log(roundGroupScoreboard);
        // }

        this.matches = result.roundGroupScoreboards[1].matches;
      });


    // this.http.get('assets/json-examples/single-match.json', { responseType: 'text' })
    // this.http.get('assets/json-examples/matches.json', { responseType: 'text' })
    //   .subscribe(data => {
    //     let matchesJson: string = data;
    //     let matchesService: MatchService = new MatchService(matchesJson);
    //     this.matches = matchesService.matches;
    //   });


    console.log(this.uid);
  }

  ngOnInit(): void {

  }

  deleteRound(): void {
    let roundId: number = this.uid;

    console.log("deleting round ID: " + roundId);




    this.http.delete('http://localhost:8080/rounds/' + roundId).subscribe(() => {

      console.log("deleted round!");
      // console.log("result should be empty: " + result);


      let seasonId: number = this.roundScoreboard.seasonId;
      this.router.navigate(['season-view', seasonId]);
    }

    );

  }

}
