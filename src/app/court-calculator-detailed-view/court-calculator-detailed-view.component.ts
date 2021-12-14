import { Component, OnInit } from '@angular/core';
import {PlayerForCourt} from "./player-for-court.model";
import {PresenceForCourt} from "./presence-for-court.model";
import {MatTableDataSource} from "@angular/material/table";
import {SeasonScoreboardRow} from "../shared/rest-api-dto/season-scoreboard-row.model";
import {Player} from "../shared/rest-api-dto/player.model";

@Component({
  selector: 'app-court-calculator-detailed-view',
  templateUrl: './court-calculator-detailed-view.component.html',
  styleUrls: ['./court-calculator-detailed-view.component.css']
})
export class CourtCalculatorDetailedViewComponent implements OnInit {

  displayedColumns: string[] = [
    'player-column',
    'delete-column',
    'to-pay-column',
    'hour-1-column',
    'hour-2-column',
    'hour-3-column',
  ];

  players: PlayerForCourt[];
  dataSource: MatTableDataSource<PlayerForCourt>;

  firstHourCourts: number = 0;
  secondHourCourts: number = 0;
  thirdHourCourts: number = 0;

  constructor() {

  }

  ngOnInit(): void {
    if (localStorage.getItem('PLAYERS_COURTS')) {
      this.players = JSON.parse(localStorage.getItem('PLAYERS_COURTS'));

    } else {
      this.players = [];

      // player 1
      let presence11: PresenceForCourt = new PresenceForCourt();
      presence11.isPresent = true;
      presence11.hour = 1;
      presence11.hasMultisport = true;

      let presence12: PresenceForCourt = new PresenceForCourt();
      presence12.isPresent = true;
      presence12.hour = 2;
      presence12.hasMultisport = true;

      let presence13: PresenceForCourt = new PresenceForCourt();
      presence13.isPresent = false;
      presence13.hour = 2;
      presence13.hasMultisport = false;

      let presences1: PresenceForCourt[] = [];
      presences1.push(presence11, presence12, presence13);

      let player1: PlayerForCourt = new PlayerForCourt();
      player1.name = 'name1';
      player1.presences = presences1;

      // player 2
      let presence21: PresenceForCourt = new PresenceForCourt();
      presence21.isPresent = true;
      presence21.hour = 1;
      presence21.hasMultisport = false;

      let presence22: PresenceForCourt = new PresenceForCourt();
      presence22.isPresent = false;
      presence22.hour = 2;
      presence22.hasMultisport = false;

      let presence23: PresenceForCourt = new PresenceForCourt();
      presence23.isPresent = false;
      presence23.hour = 2;
      presence23.hasMultisport = false;

      let presences2: PresenceForCourt[] = [];
      presences2.push(presence21, presence22, presence23);

      let player2: PlayerForCourt = new PlayerForCourt();
      player2.name = 'name2';
      player2.presences = presences2;

      this.players.push(player1, player2);
    }

    console.log(this.players);
    this.dataSource = new MatTableDataSource(this.players);
  }

  deletePlayer(player: PlayerForCourt) {
    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }

  addPlayer() {
    // player 1
    let presence11: PresenceForCourt = new PresenceForCourt();
    presence11.isPresent = false;
    presence11.hour = 1;
    presence11.hasMultisport = false;

    let presence12: PresenceForCourt = new PresenceForCourt();
    presence12.isPresent = false;
    presence12.hour = 2;
    presence12.hasMultisport = false;

    let presence13: PresenceForCourt = new PresenceForCourt();
    presence13.isPresent = false;
    presence13.hour = 2;
    presence13.hasMultisport = false;

    let presences1: PresenceForCourt[] = [];
    presences1.push(presence11, presence12, presence13);

    let player1: PlayerForCourt = new PlayerForCourt();
    player1.name = 'newName';
    player1.presences = presences1;

    this.players.push(player1);
    this.dataSource._updateChangeSubscription();
  }

  save() {
    localStorage.setItem('PLAYERS_COURTS', JSON.stringify(this.players))
  }
}
