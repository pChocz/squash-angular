import { Component, OnInit, Input } from '@angular/core';
import { Match } from 'src/app/shared/match.model';

@Component({
  selector: 'app-round-group-matches',
  templateUrl: './round-group-matches.component.html',
  styleUrls: ['./round-group-matches.component.css']
})
export class RoundGroupMatchesComponent implements OnInit {

  @Input() matches: Match[];

  displayedColumns: string[] = [
    'first-player',
    'second-player',
    'first-set-first-player',
    'first-set-second-player',
    'second-set-first-player',
    'second-set-second-player',
    'third-set-first-player',
    'third-set-second-player',
  ];

  constructor() {

  }

  ngOnInit(): void {

  }

}
