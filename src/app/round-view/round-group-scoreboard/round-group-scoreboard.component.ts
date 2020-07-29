import { Component, OnInit, Input } from '@angular/core';
import { RoundGroupScoreboard } from '../model/round-group-scoreboard.model';

@Component({
  selector: 'app-round-group-scoreboard',
  templateUrl: './round-group-scoreboard.component.html',
  styleUrls: ['./round-group-scoreboard.component.css']
})
export class RoundGroupScoreboardComponent implements OnInit {

  displayedColumns: string[] = [
    'place-in-round-column',
    'place-in-group-column',
    'xp-earned-column',
    'player-column',
    'matches-plus-column',
    'matches-minus-column',
    'matches-balance-column',
    'sets-plus-column',
    'sets-minus-column',
    'sets-balance-column',
    'points-plus-column',
    'points-minus-column',
    'points-balance-column',
  ];

  @Input() roundGroupScoreboard: RoundGroupScoreboard;

  constructor() { 
    console.log("hello from RoundGroupScoreboardComponent")
  }


  ngOnInit(): void {
  }

}
