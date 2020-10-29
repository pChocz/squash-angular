import {Component, Input, OnInit} from '@angular/core';
import {LeagueRole} from "../../shared/rest-api-dto/league-role.model";

@Component({
  selector: 'app-leagues-summary',
  templateUrl: './leagues-summary.component.html',
  styleUrls: ['./leagues-summary.component.css']
})
export class LeaguesSummaryComponent implements OnInit {

  @Input() leagueRoles: LeagueRole[];
  leagueRolesPlayer: LeagueRole[]

  constructor() {
  }

  ngOnInit(): void {
    this.leagueRolesPlayer = this.leagueRoles.filter(role => role.leagueRole === 'PLAYER');
  }

}
