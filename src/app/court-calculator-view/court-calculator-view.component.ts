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

  // predefined changable values
  reducePerHour: number = 15;
  ratePerHour: number = 60;
  playersPerGroup: number[] = [5, 5, 0, 0];
  courtsPerHour: number[] = [4, 4, 0];

  // results
  allPlayers: number;
  allMatches: number;
  minutesPerMatch: number;
  totalCost: number;
  hoursPlayed: number;
  costPerPlayer: number;
  costPerPlayerReduced: number;

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

  countHoursPlayed(): number {
    let hoursPlayed = 0;
    for (let count of this.courtsPerHour) {
      if (count > 0) {
        hoursPlayed++;
      }
    }
    return hoursPlayed;
  }

  getReducedCost(): number {
    return this.costPerPlayer - this.reducePerHour * this.hoursPlayed;
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
    this.hoursPlayed = this.countHoursPlayed();
    this.costPerPlayer = this.calculateCostPerPlayer();
    this.costPerPlayerReduced = this.getReducedCost();
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

  private calculateCostPerPlayer(): number {
    return this.totalCost / this.allPlayers;
  }
}
