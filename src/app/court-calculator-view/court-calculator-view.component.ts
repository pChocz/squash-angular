import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-court-calculator-view',
  templateUrl: './court-calculator-view.component.html',
  styleUrls: ['./court-calculator-view.component.css']
})
export class CourtCalculatorViewComponent implements OnInit {

  // predefined non-changable values
  MIN_VALUE: number = 0;
  MAX_PLAYERS_PER_GROUP: number = 9;
  MAX_COURTS_PER_HOUR: number = 4;
  MAX_RATE_PER_HOUR: number = 95;
  REDUCE_PER_MULTISPORT: number[] = [15, 30, 45, 60];
  REDUCE_PER_MULTISPORT_PERSON: number[] = [10, 15, 20, 30];

  // predefined changable values
  ratePerHour: number = 60;
  playersPerGroup: number[] = [5, 5, 0, 0];
  courtsPerHour: number[] = [4, 4, 0];
  addToRound: number = 10;
  playersMultisport: number[] = [0, 0, 0, 0];

  // results
  allPlayers: number;
  allMatches: number;
  minutesPerMatch: number;
  totalCost: number;
  totalMultisportReduce: number;
  totalToPayCash: number;
  costPerPlayerFixed: number;
  costPerPlayerReal: number[] = [0, 0, 0, 0, 0];

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
    this.update();
  }

  calculateTotalCost(): number {
    let allCourtHours = 0;
    for (let count of this.courtsPerHour) {
      allCourtHours += count;
    }
    return allCourtHours * this.ratePerHour;
  }

  decrementPlayersPerGroup(number: number): void {
    if (this.playersPerGroup[number] > this.MIN_VALUE) {
      this.playersPerGroup[number]--;
    }
    this.update();
  }

  incrementPlayersPerGroup(number: number): void {
    if (this.playersPerGroup[number] < this.MAX_PLAYERS_PER_GROUP) {
      this.playersPerGroup[number]++;
    }
    this.update();
  }

  decrementCourtsPerHour(number: number): void {
    if (this.courtsPerHour[number] > this.MIN_VALUE) {
      this.courtsPerHour[number]--;
    }
    this.update();
  }

  incrementCourtsPerHour(number: number): void {
    if (this.courtsPerHour[number] < this.MAX_COURTS_PER_HOUR) {
      this.courtsPerHour[number]++;
    }
    this.update();
  }

  incrementRatePerHour(): void {
    if (this.ratePerHour < this.MAX_RATE_PER_HOUR) {
      this.ratePerHour += 5;
    }
    this.update();
  }

  decrementRatePerHour(): void {
    if (this.ratePerHour > this.MIN_VALUE) {
      this.ratePerHour -= 5;
    }
    this.update();
  }


  incrementAddToRound(): void {
    this.addToRound += 1;
    this.update();
  }

  decrementAddToRound(): void {
    this.addToRound -= 1;
    this.update();
  }

  incrementPlayersMultisport(val): void {
    const allPlayers = this.countAllPlayers();
    const allMultisportPlayers = this.countMultisportPlayers();
    if (allMultisportPlayers < allPlayers) {
      this.playersMultisport[val] += 1;
    }
    this.update();
  }

  decrementPlayersMultisport(val): void {
    if (this.playersMultisport[val] > this.MIN_VALUE) {
      this.playersMultisport[val] -= 1;
    }
    this.update();
  }

  countAllPlayers(): number {
    let allPlayers = 0;
    for (let count of this.playersPerGroup) {
      allPlayers += count;
    }
    return allPlayers;
  }

  countMultisportPlayers() {
    return this
        .playersMultisport
        .reduce((sum, current) => sum + current, 0);
  }

  private update() {
    this.allPlayers = this.countAllPlayers();
    this.allMatches = this.countAllMatches();
    this.minutesPerMatch = this.calculateMinutesPerMatch();
    this.totalCost = this.calculateTotalCost();
    this.totalMultisportReduce = this.calculateMultisportReduce();
    this.totalToPayCash = this.calculateTotalToPayCash();
    this.costPerPlayerFixed = this.calculateFixedCostPerPlayer() + this.addToRound / this.countAllPlayers();
    this.costPerPlayerReal[0] = this.calculateCostPerPlayerNoMulti();
    this.costPerPlayerReal[1] = this.costPerPlayerReal[0] - this.REDUCE_PER_MULTISPORT_PERSON[0];
    this.costPerPlayerReal[2] = this.costPerPlayerReal[0] - this.REDUCE_PER_MULTISPORT_PERSON[1];
    this.costPerPlayerReal[3] = this.costPerPlayerReal[0] - this.REDUCE_PER_MULTISPORT_PERSON[2];
    this.costPerPlayerReal[4] = this.costPerPlayerReal[0] - this.REDUCE_PER_MULTISPORT_PERSON[3];
  }

  private calculateMinutesPerMatch(): number {
    let allMinutes = 0;
    for (let count of this.courtsPerHour) {
      allMinutes += count * 60;
    }
    let allMatches = this.countAllMatches();
    return allMinutes / allMatches
  }

  private countAllMatches(): number {
    let allMatches = 0;
    for (let count of this.playersPerGroup) {
      allMatches += CourtCalculatorViewComponent.countCombinations(count);
    }
    return allMatches;
  }

  private calculateFixedCostPerPlayer(): number {
    return this.totalCost / this.allPlayers;
  }

  private calculateMultisportReduce(): number {
    return this.playersMultisport[0] * this.REDUCE_PER_MULTISPORT[0]
        + this.playersMultisport[1] * this.REDUCE_PER_MULTISPORT[1]
        + this.playersMultisport[2] * this.REDUCE_PER_MULTISPORT[2]
        + this.playersMultisport[3] * this.REDUCE_PER_MULTISPORT[3];
  }

  private calculateTotalToPayCash(): number {
    return this.totalCost - this.totalMultisportReduce;
  }

  private calculateCostPerPlayerNoMulti(): number {
    const reduceMulti1: number = this.playersMultisport[0] * this.REDUCE_PER_MULTISPORT_PERSON[0];
    const reduceMulti2: number = this.playersMultisport[1] * this.REDUCE_PER_MULTISPORT_PERSON[1];
    const reduceMulti3: number = this.playersMultisport[2] * this.REDUCE_PER_MULTISPORT_PERSON[2];
    const reduceMulti4: number = this.playersMultisport[3] * this.REDUCE_PER_MULTISPORT_PERSON[3];
    const totalReduce: number = reduceMulti1 + reduceMulti2 + reduceMulti3 + reduceMulti4;
    return (this.totalToPayCash + this.addToRound + totalReduce) / this.countAllPlayers();
  }

}
