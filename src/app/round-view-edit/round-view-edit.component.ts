import { Component, OnInit } from '@angular/core';
import { RoundScoreboard } from '../round-view/model/round-scoreboard.model';
import { Match } from '../shared/match.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-round-view-edit',
  templateUrl: './round-view-edit.component.html',
  styleUrls: ['./round-view-edit.component.css']
})
export class RoundViewEditComponent implements OnInit {

  durationInSeconds = 7;

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
    private titleService: Title,
    private snackBar: MatSnackBar) {


    this.route.params.subscribe(params => this.uid = params["uid"]);


    this.http.get<RoundScoreboard>('http://localhost:8082/scoreboards/rounds/' + this.uid)
      .pipe(
        map(result => plainToClass(RoundScoreboard, result)))
      .subscribe(result => {
        console.log(result);
        this.roundScoreboard = result

        this.titleService.setTitle("Editing: Round " + this.roundScoreboard.roundNumber + " | Season " + this.roundScoreboard.seasonNumber + " | " + this.roundScoreboard.leagueName);


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




    this.http.delete('http://localhost:8082/rounds/' + roundId).subscribe(() => {

      console.log("deleted round!");
      // console.log("result should be empty: " + result);


      let seasonId: number = this.roundScoreboard.seasonId;
      this.router.navigate(['season-view', seasonId]);
    }

    );

  }

  updating(event: any): void {
    let updatedMatch: Match = event;

    console.log("updating message from upper component");
    console.log(event);
    console.log("match: " + updatedMatch.getResult());




    this.http.get<RoundScoreboard>('http://localhost:8082/scoreboards/rounds/' + this.uid)
      .pipe(
        map(result => plainToClass(RoundScoreboard, result)))
      .subscribe(
        result => {
          console.log(result);
          this.roundScoreboard = result

          let updatedMatchPersisted: Match = this.roundScoreboard.findMatchById(updatedMatch.matchId)

          this.snackBar.open("Match Updated: " + updatedMatchPersisted.getResult(), "X", {
            duration: this.durationInSeconds * 1000,
            panelClass: ['mat-toolbar', 'mat-primary']
          });

        },
        error => {
          console.log(error);
        }
      );

  }

}
