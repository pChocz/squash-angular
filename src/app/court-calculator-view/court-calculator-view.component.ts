import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

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
  REDUCE_PER_MULTISPORT_MINUS: number = 15;
  REDUCE_PER_MULTISPORT_PLUS: number = 30;
  REDUCE_PER_MULTISPORT_MINUS_PERSON: number = 10;
  REDUCE_PER_MULTISPORT_PLUS_PERSON: number = 15;

  // predefined changable values
  ratePerHour: number = 60;
  playersPerGroup: number[] = [5, 5, 0, 0];
  courtsPerHour: number[] = [4, 4, 0];
  addToRound: number = 10;
  playersMultisportMinus: number = 0;
  playersMultisportPlus: number = 0;

  // results
  allPlayers: number;
  allMatches: number;
  minutesPerMatch: number;
  totalCost: number;
  totalMultisportReduce: number;
  totalToPayCash: number;
  costPerPlayerFixed: number;
  costPerPlayerNoMulti: number;
  costPerPlayerMultiMinus: number;
  costPerPlayerMultiPlus: number;


  constructor(private titleService: Title,
              private translateService: TranslateService) {
    this.translateService
    .get('courtCalculator.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
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
    if (this.addToRound < this.MAX_RATE_PER_HOUR) {
      this.addToRound += 1;
    }
    this.update();
  }

  decrementAddToRound(): void {
    if (this.addToRound > this.MIN_VALUE) {
      this.addToRound -= 1;
    }
    this.update();
  }


  incrementPlayersMultisportMinus(): void {
    if (this.playersMultisportMinus < this.countAllPlayers() - this.playersMultisportPlus) {
      this.playersMultisportMinus += 1;
    }
    this.update();
  }

  decrementPlayersMultisportMinus(): void {
    if (this.playersMultisportMinus > this.MIN_VALUE) {
      this.playersMultisportMinus -= 1;
    }
    this.update();
  }


  incrementPlayersMultisportPlus(): void {
    if (this.playersMultisportPlus < this.countAllPlayers() - this.playersMultisportMinus) {
      this.playersMultisportPlus += 1;
    }
    this.update();
  }

  decrementPlayersMultisportPlus(): void {
    if (this.playersMultisportPlus > this.MIN_VALUE) {
      this.playersMultisportPlus -= 1;
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

  private update() {
    this.allPlayers = this.countAllPlayers();
    this.allMatches = this.countAllMatches();
    this.minutesPerMatch = this.calculateMinutesPerMatch();
    this.totalCost = this.calculateTotalCost();
    this.totalMultisportReduce = this.calculateMultisportReduce();
    this.totalToPayCash = this.calculateTotalToPayCash();
    this.costPerPlayerFixed = this.calculateFixedCostPerPlayer() + this.addToRound / this.countAllPlayers();
    this.costPerPlayerNoMulti = this.calculateCostPerPlayerNoMulti();
    this.costPerPlayerMultiMinus = this.costPerPlayerNoMulti - this.REDUCE_PER_MULTISPORT_MINUS_PERSON;
    this.costPerPlayerMultiPlus = this.costPerPlayerNoMulti - this.REDUCE_PER_MULTISPORT_PLUS_PERSON;
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
    return this.playersMultisportMinus * this.REDUCE_PER_MULTISPORT_MINUS +
        this.playersMultisportPlus * this.REDUCE_PER_MULTISPORT_PLUS;
  }

  private calculateTotalToPayCash(): number {
    return this.totalCost - this.totalMultisportReduce;
  }

  private calculateCostPerPlayerNoMulti(): number {
    const reduceMultiMinus: number = this.playersMultisportMinus * this.REDUCE_PER_MULTISPORT_MINUS_PERSON;
    const reduceMultiPlus: number = this.playersMultisportPlus * this.REDUCE_PER_MULTISPORT_PLUS_PERSON;
    return (this.totalToPayCash + this.addToRound + reduceMultiMinus + reduceMultiPlus) / (this.countAllPlayers());
  }

}
