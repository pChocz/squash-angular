import {Component, Input, OnInit} from '@angular/core';
import {LeagueOveralStats} from "../../shared/rest-api-dto/league-overal-stats.model";
import {SetComputeHelper} from "../../shared/set-compute-helper";

@Component({
  selector: 'app-league-board',
  templateUrl: './league-board.component.html',
  styleUrls: ['./league-board.component.css']
})
export class LeagueBoardComponent implements OnInit {

  @Input() overalStats: LeagueOveralStats;
  @Input() uuid: string;
  @Input() isModerator: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  computeExampleSetResults(type: string, points: number): string {
    return SetComputeHelper.computeExampleSetResults(type, points);
  }

}
