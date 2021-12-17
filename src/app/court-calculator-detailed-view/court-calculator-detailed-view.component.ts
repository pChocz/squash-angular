import {Component, OnInit} from '@angular/core';
import {PlayerForCourt} from "./player-for-court.model";
import {MatTableDataSource} from "@angular/material/table";
import {CourtPay} from "./court-pay.model";

@Component({
  selector: 'app-court-calculator-detailed-view',
  templateUrl: './court-calculator-detailed-view.component.html',
  styleUrls: ['./court-calculator-detailed-view.component.css']
})
export class CourtCalculatorDetailedViewComponent implements OnInit {

  displayedColumns: string[] = [
    'player-column',
    'to-pay-column',
    'hour-1-column',
    'hour-2-column',
    'hour-3-column',
    'delete-column',
  ];

  players: PlayerForCourt[];
  dataSource: MatTableDataSource<PlayerForCourt>;
  courtPay: CourtPay;

  constructor() {
    this.courtPay = new CourtPay();
  }

  private static initializePlayers(): PlayerForCourt[] {
    let players = [];
    for (let i = 0; i < 3; i++) {
      players.push(new PlayerForCourt('Player_' + (i + 1)));
    }
    return players;
  }

  ngOnInit(): void {
    if (localStorage.getItem('PLAYERS_COURTS')) {
      this.players = JSON.parse(localStorage.getItem('PLAYERS_COURTS'));
    } else {
      this.players = CourtCalculatorDetailedViewComponent.initializePlayers();
    }
    this.dataSource = new MatTableDataSource(this.players);
  }

  deletePlayer(player: PlayerForCourt) {
    const index = this.players.indexOf(player);
    this.players.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }

  addPlayer() {
    let newPlayerIndex = this.players.length + 1;
    let newPlayer = new PlayerForCourt('Player_' + newPlayerIndex);
    this.players.push(newPlayer);
    this.dataSource._updateChangeSubscription();
  }

  save() {
    localStorage.setItem('PLAYERS_COURTS', JSON.stringify(this.players))
  }
}
