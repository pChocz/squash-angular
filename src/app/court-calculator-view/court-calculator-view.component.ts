import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-court-calculator-view',
  templateUrl: './court-calculator-view.component.html',
  styleUrls: ['./court-calculator-view.component.css']
})
export class CourtCalculatorViewComponent implements OnInit {

  playersPerGroup: number[] = [5, 5, 0, 0];
  courtsPerHour: number[] = [4, 4, 0, 0];
  ratePerHour: number = 60;
  totalRate: number = 0;
  ratePerPlayer: number[] = [0, 0, 0];
  minutesPerMatch: number;
  allMatches: number;

  constructor(private titleService: Title,
              private translateService: TranslateService) {

    this.translateService
    .get('courtCalculator.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
    });

    this.update();
  }

  private update() {
    this.minutesPerMatch = this.calculateMinutesPerMatch();
    this.allMatches = this.calculateNumberOfAllMatches();
    this.ratePerPlayer[0] = this.calculateTotalCost() / this.allPlayers();
    this.ratePerPlayer[1] = this.ratePerPlayer[0] - 15;
    this.ratePerPlayer[2] = this.ratePerPlayer[0] - 30;
  }

  private allPlayers(): number {
    let allPlayers = 0;
    for (let i = 0; i < 3; i++) {
      allPlayers += this.playersPerGroup[i];
    }
    return allPlayers;
  }

  calculateTotalCost(): number {
    let allCourtHours = 0;
    for (let i = 0; i < 3; i++) {
      allCourtHours += this.courtsPerHour[i];
    }
    return allCourtHours * this.ratePerHour;
  }

  private calculateMinutesPerMatch(): number {
    let allMinutes = 0;
    for (let i = 0; i < 3; i++) {
      allMinutes += this.courtsPerHour[i] * 60;
    }

    let allMatches = this.calculateNumberOfAllMatches();

    return allMinutes / allMatches
  }

  private calculateNumberOfAllMatches(): number {
    let allMatches = 0;
    for (let i = 0; i < 3; i++) {
      allMatches += this.calculateNumberOfMatchesForPlayers(this.playersPerGroup[i]);
    }
    return allMatches;
  }

  private calculateNumberOfMatchesForPlayers(players: number): number {
    return players * (players-1) / 2;
  }

  ngOnInit(): void {
  }

  decrementPlayersPerGroup(number: number) {
    if (this.playersPerGroup[number] > 0) {
      this.playersPerGroup[number]--;
    }
    this.update();
  }

  incrementPlayersPerGroup(number: number) {
    if (this.playersPerGroup[number] < 9) {
      this.playersPerGroup[number]++;
    }
    this.update();
  }

  decrementCourtsPerHour(number: number) {
    if (this.courtsPerHour[number] > 0) {
      this.courtsPerHour[number]--;
    }
    this.update();
  }

  incrementCourtsPerHour(number: number) {
    if (this.courtsPerHour[number] < 5) {
      this.courtsPerHour[number]++;
    }
    this.update();
  }

  incrementRatePerHour() {
    this.ratePerHour += 5;
    this.update();
  }

  decrementRatePerHour() {
    this.ratePerHour -= 5;
    this.update();
  }

}
