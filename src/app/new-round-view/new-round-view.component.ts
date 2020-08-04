import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player } from '../shared/player.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-new-round-view',
  templateUrl: './new-round-view.component.html',
  styleUrls: ['./new-round-view.component.css']
})

export class NewRoundViewComponent implements OnInit {

  seasonId: number;
  players: Player[];
  selectedPlayers: Player[];
  numberOfGroups: number = 2;
  availableNumberOfGroups: number[] = [1, 2, 3, 4];
  selectedPlayersGroup: Map<number, Player[]> = new Map();
  roundDate: Date = new Date();

  roundNumber: number = 5;
  seasonNumber: number = 6;
  leagueName: string = "Dziadoliga";


  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.params.subscribe(params => this.seasonId = params["seasonId"]);
    console.log("season id: " + this.seasonId);

    this.selectedPlayersGroup.set(1, []);
    this.selectedPlayersGroup.set(2, []);
    this.selectedPlayersGroup.set(3, []);
    this.selectedPlayersGroup.set(4, []);

    this.http.get<Player[]>('http://localhost:8080/scoreboards/seasons/' + this.seasonId + '/players-sorted')
      .pipe(
        map(result => plainToClass(Player, result)))
      .subscribe(result => {
        console.log(result);
        this.players = result;
        console.log("dupa");
      });

  }

  ngOnInit(): void {
  }

  onNumberOfGroupsChange(value: number): void {
    for (let groupNumber = value + 1; groupNumber <= 4; groupNumber++) {
      this.selectedPlayersGroup.set(groupNumber, []);
    }
    console.log("dupa");
    console.log(this.selectedPlayersGroup);
  }

  onCheckboxChange(player: Player, groupNumber: number, selected: boolean): void {
    if (selected) {
      this.selectedPlayersGroup.get(groupNumber).push(player);
    } else {
      this.selectedPlayersGroup.set(groupNumber, this.selectedPlayersGroup.get(groupNumber).filter(item => item !== player));
    }
    console.log("dupa");
    console.log(this.selectedPlayersGroup);
  }

  sendCreateRoundRequest(): void {

    let playerIdsGroupOne: string = Array.prototype.map.call(this.selectedPlayersGroup.get(1), (player: Player) => player.id);
    let playerIdsGroupTwo: string = Array.prototype.map.call(this.selectedPlayersGroup.get(2), (player: Player) => player.id);
    let dateFormatted: string = formatDate(this.roundDate, 'yyyy-MM-dd', 'en-US');

    console.log("round number: " + this.roundNumber);
    console.log("round date: " + dateFormatted);
    console.log("season ID: " + this.seasonId);
    console.log("1st group: " + playerIdsGroupOne);
    console.log("2nd group: " + playerIdsGroupTwo);

    // let params = new HttpParams().set("paramName",paramValue).set("paramName2", paramValue2); //Create new HttpParams
  }

}
