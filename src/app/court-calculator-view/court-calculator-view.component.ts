import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {MyLoggerService} from "../shared/my-logger.service";
import {CourtPayRound} from "./court-pay-round.model";

@Component({
  selector: 'app-court-calculator-view',
  templateUrl: './court-calculator-view.component.html',
  styleUrls: ['./court-calculator-view.component.css']
})
export class CourtCalculatorViewComponent implements OnInit {

  // predefined non-changeable values
  MIN_VALUE: number = 0;
  MAX_PLAYERS_PER_GROUP: number = 9;
  MAX_COURTS_PER_HOUR: number = 4;
  MAX_RATE_PER_HOUR: number = 95;
  REDUCE_PER_MULTISPORT: number[] = [15, 30, 45, 60];
  REDUCE_PER_MULTISPORT_PERSON: number[] = [10, 15, 20, 25];

  courtPayRound: CourtPayRound;

  constructor(private titleService: Title,
              private loggerService: MyLoggerService,
              private translateService: TranslateService) {
    this.translateService
    .get('menu.courtCalculator')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
      this.loggerService.log(translation);
    });
  }

  private static countCombinations(value: number): number {
    return value * (value - 1) / 2;
  }

  ngOnInit(): void {
    if (localStorage.getItem('COURT_PAY_ROUND')) {
      this.courtPayRound = JSON.parse(localStorage.getItem('COURT_PAY_ROUND'));
      this.update();
    } else {
      this.courtPayRound = new CourtPayRound();
    }
  }

  save() {
    localStorage.setItem('COURT_PAY_ROUND', JSON.stringify(this.courtPayRound))
  }

  calculateTotalCost(): number {
    let allCourtHours = 0;
    for (let count of this.courtPayRound.courtsPerHour) {
      allCourtHours += count;
    }
    return allCourtHours * this.courtPayRound.ratePerHour;
  }

  decrementPlayersPerGroup(number: number): void {
    if (this.courtPayRound.playersPerGroup[number] > this.MIN_VALUE) {
      this.courtPayRound.playersPerGroup[number]--;
    }
    this.update();
  }

  incrementPlayersPerGroup(number: number): void {
    if (this.courtPayRound.playersPerGroup[number] < this.MAX_PLAYERS_PER_GROUP) {
      this.courtPayRound.playersPerGroup[number]++;
    }
    this.update();
  }

  decrementCourtsPerHour(number: number): void {
    if (this.courtPayRound.courtsPerHour[number] > this.MIN_VALUE) {
      this.courtPayRound.courtsPerHour[number]--;
    }
    this.update();
  }

  incrementCourtsPerHour(number: number): void {
    if (this.courtPayRound.courtsPerHour[number] < this.MAX_COURTS_PER_HOUR) {
      this.courtPayRound.courtsPerHour[number]++;
    }
    this.update();
  }

  incrementRatePerHour(): void {
    if (this.courtPayRound.ratePerHour < this.MAX_RATE_PER_HOUR) {
      this.courtPayRound.ratePerHour += 5;
    }
    this.update();
  }

  decrementRatePerHour(): void {
    if (this.courtPayRound.ratePerHour > this.MIN_VALUE) {
      this.courtPayRound.ratePerHour -= 5;
    }
    this.update();
  }


  incrementAddToRound(): void {
    this.courtPayRound.addToRound += 1;
    this.update();
  }

  decrementAddToRound(): void {
    this.courtPayRound.addToRound -= 1;
    this.update();
  }

  incrementPlayersMultisport(val): void {
    const allPlayers = this.countAllPlayers();
    const allMultisportPlayers = this.countMultisportPlayers();
    if (allMultisportPlayers < allPlayers) {
      this.courtPayRound.playersMultisport[val] += 1;
    }
    this.update();
  }

  decrementPlayersMultisport(val): void {
    if (this.courtPayRound.playersMultisport[val] > this.MIN_VALUE) {
      this.courtPayRound.playersMultisport[val] -= 1;
    }
    this.update();
  }

  countAllPlayers(): number {
    let allPlayers = 0;
    for (let count of this.courtPayRound.playersPerGroup) {
      allPlayers += count;
    }
    return allPlayers;
  }

  countMultisportPlayers() {
    return this
        .courtPayRound
        .playersMultisport
        .reduce((sum, current) => sum + current, 0);
  }

  private update() {
    this.courtPayRound.allPlayers = this.countAllPlayers();
    this.courtPayRound.allMatches = this.countAllMatches();
    this.courtPayRound.minutesPerMatch = this.calculateMinutesPerMatch();
    this.courtPayRound.totalCost = this.calculateTotalCost();
    this.courtPayRound.totalMultisportReduce = this.calculateMultisportReduce();
    this.courtPayRound.totalToPayCash = this.calculateTotalToPayCash();
    this.courtPayRound.costPerPlayerFixed = this.calculateFixedCostPerPlayer() + this.courtPayRound.addToRound / this.countAllPlayers();
    this.courtPayRound.costPerPlayerReal[0] = this.calculateCostPerPlayerNoMulti();
    this.courtPayRound.costPerPlayerReal[1] = this.courtPayRound.costPerPlayerReal[0] - this.REDUCE_PER_MULTISPORT_PERSON[0];
    this.courtPayRound.costPerPlayerReal[2] = this.courtPayRound.costPerPlayerReal[0] - this.REDUCE_PER_MULTISPORT_PERSON[1];
    this.courtPayRound.costPerPlayerReal[3] = this.courtPayRound.costPerPlayerReal[0] - this.REDUCE_PER_MULTISPORT_PERSON[2];
    this.courtPayRound.costPerPlayerReal[4] = this.courtPayRound.costPerPlayerReal[0] - this.REDUCE_PER_MULTISPORT_PERSON[3];
  }

  private calculateMinutesPerMatch(): number {
    let allMinutes = 0;
    for (let count of this.courtPayRound.courtsPerHour) {
      allMinutes += count * 60;
    }
    let allMatches = this.countAllMatches();
    return allMinutes / allMatches
  }

  private countAllMatches(): number {
    let allMatches = 0;
    for (let count of this.courtPayRound.playersPerGroup) {
      allMatches += CourtCalculatorViewComponent.countCombinations(count);
    }
    return allMatches;
  }

  private calculateFixedCostPerPlayer(): number {
    return this.courtPayRound.totalCost / this.courtPayRound.allPlayers;
  }

  private calculateMultisportReduce(): number {
    return this.courtPayRound.playersMultisport[0] * this.REDUCE_PER_MULTISPORT[0]
        + this.courtPayRound.playersMultisport[1] * this.REDUCE_PER_MULTISPORT[1]
        + this.courtPayRound.playersMultisport[2] * this.REDUCE_PER_MULTISPORT[2]
        + this.courtPayRound.playersMultisport[3] * this.REDUCE_PER_MULTISPORT[3];
  }

  private calculateTotalToPayCash(): number {
    return this.courtPayRound.totalCost - this.courtPayRound.totalMultisportReduce;
  }

  private calculateCostPerPlayerNoMulti(): number {
    const reduceMulti1: number = this.courtPayRound.playersMultisport[0] * this.REDUCE_PER_MULTISPORT_PERSON[0];
    const reduceMulti2: number = this.courtPayRound.playersMultisport[1] * this.REDUCE_PER_MULTISPORT_PERSON[1];
    const reduceMulti3: number = this.courtPayRound.playersMultisport[2] * this.REDUCE_PER_MULTISPORT_PERSON[2];
    const reduceMulti4: number = this.courtPayRound.playersMultisport[3] * this.REDUCE_PER_MULTISPORT_PERSON[3];
    const totalReduce: number = reduceMulti1 + reduceMulti2 + reduceMulti3 + reduceMulti4;
    return (this.courtPayRound.totalToPayCash + this.courtPayRound.addToRound + totalReduce) / this.countAllPlayers();
  }

}
