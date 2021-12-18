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
    'hour-3-column'
  ];

  dataSource: MatTableDataSource<PlayerForCourt>;
  courtPay: CourtPay;

  constructor() {
  }

  ngOnInit(): void {
    if (localStorage.getItem('COURT_PAY')) {
      this.courtPay = JSON.parse(localStorage.getItem('COURT_PAY'));
      this.calculate();
    } else {
      this.courtPay = new CourtPay();
    }
    this.dataSource = new MatTableDataSource(this.courtPay.players);
  }

  deletePlayer(player: PlayerForCourt) {
    const index = this.courtPay.players.indexOf(player);
    this.courtPay.players.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.calculate();
  }

  addPlayer() {
    let newPlayerIndex = this.courtPay.players.length + 1;
    let newPlayer = new PlayerForCourt('Player_' + newPlayerIndex);
    this.courtPay.players.push(newPlayer);
    this.dataSource._updateChangeSubscription();
  }

  removeLastPlayer() {
    const index = this.courtPay.players.length - 1;
    this.courtPay.players.splice(index, 1);
    this.dataSource._updateChangeSubscription();
    this.calculate();
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
      for (let i = 0; i < 3; i++) {
        let presence = player.presences[i]
        let isAnyCourtTaken = this.courtPay.courtsPerHour[i] > 0;
        if (presence.isPresent && presence.hasMultisport && isAnyCourtTaken) {
          numberOfMultisportCards++;
        }
      }
    }

    this.courtPay.totalPay = totalPay;
    this.courtPay.multisportDeduct = numberOfMultisportCards * this.courtPay.singleMultisportDeduct;
    this.courtPay.totalPayMultisportDeducted = this.courtPay.totalPay - this.courtPay.multisportDeduct;


    // calculate the amount to pay for each player
    if (this.courtPay.socialismMode) {
      this.calculateSocialism();
    } else {
      this.calculateRegular();
    }
  }

  decreaseRateForCourt() {
    if (this.courtPay.ratePerCourtPerHour > 40) {
      this.courtPay.ratePerCourtPerHour = this.courtPay.ratePerCourtPerHour - 5;
      this.calculate();
    }
  }

  increaseRateForCourt() {
    if (this.courtPay.ratePerCourtPerHour < 100) {
      this.courtPay.ratePerCourtPerHour = this.courtPay.ratePerCourtPerHour + 5;
      this.calculate();
    }
  }

  decreaseMultisportReduction() {
    if (this.courtPay.singleMultisportDeduct > 0) {
      this.courtPay.singleMultisportDeduct = this.courtPay.singleMultisportDeduct - 5;
      this.calculate();
    }
  }

  increaseMultisportReduction() {
    if (this.courtPay.singleMultisportDeduct < 20) {
      this.courtPay.singleMultisportDeduct = this.courtPay.singleMultisportDeduct + 5;
      this.calculate();
    }
  }

  decreaseCourtsForHour(hour: number) {
    if (this.courtPay.courtsPerHour[hour] > 0) {
      this.courtPay.courtsPerHour[hour] = this.courtPay.courtsPerHour[hour] - 1;
      this.calculate();
    }
  }

  increaseCourtsForHour(hour: number) {
    if (this.courtPay.courtsPerHour[hour] < 4) {
      this.courtPay.courtsPerHour[hour] = this.courtPay.courtsPerHour[hour] + 1;
      this.calculate();
    }
  }

  private calculateSocialism() {
    for (let player of this.courtPay.players) {
      let amountToPay = 0;
      for (let i = 0; i < 3; i++) {
        let courtsPerHour = this.courtPay.courtsPerHour[i];
        let multisportCardsForCurrentHour = 0;
        let playersForCurrentHour = 0;
        for (let player of this.courtPay.players) {
          if (player.presences[i].isPresent) {
            playersForCurrentHour++;
          }
          if (player.presences[i].isPresent && player.presences[i].hasMultisport) {
            multisportCardsForCurrentHour++;
          }
        }
        if (courtsPerHour && playersForCurrentHour > 0 && player.presences[i].isPresent) {
          let amountPerHour = courtsPerHour * this.courtPay.ratePerCourtPerHour;
          let deductionPerHour = multisportCardsForCurrentHour * this.courtPay.singleMultisportDeduct;
          let toPayPerHour = amountPerHour - deductionPerHour;
          amountToPay = amountToPay + toPayPerHour / playersForCurrentHour;
        }
      }
      player.toPay = amountToPay;
    }
  }

  private calculateRegular() {
    for (let player of this.courtPay.players) {
      let amountToPay = 0;
      for (let i = 0; i < 3; i++) {
        let courtsPerHour = this.courtPay.courtsPerHour[i]
        let isPlayerPresent = player.presences[i].isPresent
        if (courtsPerHour > 0 && isPlayerPresent) {
          let playersForCurrentHour = this.countPlayersForCurrentHour(i);
          amountToPay = amountToPay + courtsPerHour * this.courtPay.ratePerCourtPerHour / playersForCurrentHour;
        }
      }
      let multisportDeductAmount = this.countMultisportDeductsForPlayer(player) * this.courtPay.singleMultisportDeduct;
      player.toPay = amountToPay - multisportDeductAmount;
    }
  }

  private countMultisportDeductsForPlayer(player: PlayerForCourt): number {
    let multisportDeducts = 0;
    for (let i = 0; i < 3; i++) {
      let presence = player.presences[i]
      let isAnyCourtTaken = this.courtPay.courtsPerHour[i] > 0;
      if (presence.isPresent && presence.hasMultisport && isAnyCourtTaken) {
        multisportDeducts++;
      }
    }
    return multisportDeducts;
  }

  private countPlayersForCurrentHour(i: number): number {
    let count = 0;
    for (let player of this.courtPay.players) {
      if (player.presences[i].isPresent) {
        count++;
      }
    }
    return count;
  }
}
