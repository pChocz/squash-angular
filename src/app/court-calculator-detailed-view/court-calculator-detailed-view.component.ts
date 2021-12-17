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

  dataSource: MatTableDataSource<PlayerForCourt>;
  courtPay: CourtPay;

  constructor() {
  }


  ngOnInit(): void {
    if (localStorage.getItem('COURT_PAY')) {
      this.courtPay = JSON.parse(localStorage.getItem('COURT_PAY'));
    } else {
      this.courtPay = new CourtPay();
    }
    this.dataSource = new MatTableDataSource(this.courtPay.players);
  }

  deletePlayer(player: PlayerForCourt) {
    const index = this.courtPay.players.indexOf(player);
    this.courtPay.players.splice(index, 1);
    this.dataSource._updateChangeSubscription();
  }

  addPlayer() {
    let newPlayerIndex = this.courtPay.players.length + 1;
    let newPlayer = new PlayerForCourt('Player_' + newPlayerIndex);
    this.courtPay.players.push(newPlayer);
    this.dataSource._updateChangeSubscription();
  }

  save() {
    localStorage.setItem('COURT_PAY', JSON.stringify(this.courtPay))
  }

  calculate() {
    let totalPay = 0;
    let numberOfMultisportCards = 0;

    for (let courtsPerHour of this.courtPay.courtsPerHour) {
      totalPay += this.courtPay.ratePerCourtPerHour * courtsPerHour;
    }

    for (let player of this.courtPay.players) {
      for (let presence of player.presences) {
        if (presence.isPresent && presence.hasMultisport) {
          numberOfMultisportCards++;
        }
      }
    }

    this.courtPay.totalPay = totalPay;
    this.courtPay.multisportDeduct = numberOfMultisportCards * this.courtPay.singleMultisportDeduct;
    this.courtPay.totalPayMultisportDeducted = this.courtPay.totalPay - this.courtPay.multisportDeduct;
  }
}
