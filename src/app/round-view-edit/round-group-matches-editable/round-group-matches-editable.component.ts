import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Match } from 'src/app/shared/match.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-round-group-matches-editable',
  templateUrl: './round-group-matches-editable.component.html',
  styleUrls: ['./round-group-matches-editable.component.css']
})
export class RoundGroupMatchesEditableComponent implements OnInit {

  @Output('update')
  change: EventEmitter<Match> = new EventEmitter<Match>();

  displayedColumns: string[] = [
    'first-player',
    'second-player',
    'match-status',
    'first-set-first-player',
    'first-set-second-player',
    'second-set-first-player',
    'second-set-second-player',
    'third-set-first-player',
    'third-set-second-player',
  ];

  @Input() matches: Match[];

  constructor(
    private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
  }

  onChange(newValue: number, match: Match, setNumber: number, player: string): void {

    console.log("attempt to change set [" + setNumber + "] of match: ");
    console.log(match);

    console.log("new score for " + player + " player: ");
    console.log(newValue);

    // let params = new HttpParams()
    //   .set("matchId", match.matchId.toString())
    //   .set("setNumber", setNumber.toString())
    //   .set("player", player)
    //   .set("newScore", newValue.toString());

    // console.log(params)

    this.http.put(environment.apiUrl + 'matches',
      {},
      {
        params: {
          matchId: match.matchId.toString(),
          setNumber: setNumber.toString(),
          player: player,
          newScore: newValue.toString()
        }
      }
    ).subscribe(
      () => {
        console.log("Match succesfully changed!");
        this.change.emit(match);
      },
      error => {
        console.log("Error when changing the match: ", error);
      }
    );

  }

}
