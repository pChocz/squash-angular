import {Component, Input, OnInit} from '@angular/core';
import {League} from "../../shared/rest-api-dto/league.model";

@Component({
  selector: 'app-leagues-summary',
  templateUrl: './leagues-summary.component.html',
  styleUrls: ['./leagues-summary.component.css']
})
export class LeaguesSummaryComponent implements OnInit {

  @Input() leagues: League[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
