import {Component, Input, OnInit} from '@angular/core';
import {PerPlayerEncountersStatsResults} from "../../shared/rest-api-dto/per-player-encounters-stats-results.model";

@Component({
  selector: 'app-player-winnings',
  templateUrl: './player-winnings.component.html',
  styleUrls: ['./player-winnings.component.css']
})
export class PlayerWinningsComponent implements OnInit {

  @Input() statsResults: PerPlayerEncountersStatsResults;

  constructor() { }

  ngOnInit(): void {
  }

}
