import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Player } from '../shared/player.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { formatDate } from '@angular/common';
import { Season } from '../season-view/new-model/season.model';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-round-view',
  templateUrl: './new-round-view.component.html',
  styleUrls: ['./new-round-view.component.css']
})

export class NewRoundViewComponent implements OnInit {

  seasonUuid: string;
  roundNumber: number;
  seasonNumber: number;
  leagueName: string;
  season: Season;


  players: Player[];
  selectedPlayers: Player[];
  numberOfGroups: number = 2;
  availableNumberOfGroups: number[] = [1, 2, 3, 4];
  selectedPlayersGroup: Map<number, Player[]> = new Map();
  roundDate: Date = new Date();




  constructor(private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private titleService: Title) {

    this.titleService.setTitle("New round");

    this.route.params.subscribe(params => this.seasonUuid = params["seasonUuid"]);
    this.route.params.subscribe(params => this.roundNumber = params["roundNumber"]);
    console.log("season id: " + this.seasonUuid);
    console.log("round number: " + this.roundNumber);

    this.http.get<Season>(environment.apiUrl + 'seasons/' + this.seasonUuid)
      .pipe(
        map(result => plainToClass(Season, result)))
      .subscribe(result => {
        console.log(result);
        this.season = result;
        this.seasonNumber = this.season.seasonNumber;
        this.leagueName = this.season.leagueName;
      });


    this.selectedPlayersGroup.set(1, []);
    this.selectedPlayersGroup.set(2, []);
    this.selectedPlayersGroup.set(3, []);
    this.selectedPlayersGroup.set(4, []);

    this.http.get<Player[]>(environment.apiUrl + 'scoreboards/seasons/' + this.seasonUuid + '/players-sorted')
      .pipe(
        map(result => plainToClass(Player, result)))
      .subscribe(result => {
        console.log(result);
        this.players = result;
      });
  }

  ngOnInit(): void {
  }

  onNumberOfGroupsChange(value: number): void {
    for (let groupNumber = value + 1; groupNumber <= 4; groupNumber++) {
      this.selectedPlayersGroup.set(groupNumber, []);
    }
  }

  onCheckboxChange(player: Player, groupNumber: number, selected: boolean): void {
    if (selected) {
      this.selectedPlayersGroup.get(groupNumber).push(player);
    } else {
      this.selectedPlayersGroup.set(groupNumber, this.selectedPlayersGroup.get(groupNumber).filter(item => item !== player));
    }
  }

  sendCreateRoundRequest(): void {

    let dateFormatted: string = formatDate(this.roundDate, 'yyyy-MM-dd', 'en-US');

    console.log("round number: " + this.roundNumber);
    console.log("round date: " + dateFormatted);
    console.log("season ID: " + this.seasonUuid);

    // let playerIdsGroupOne: string = Array.prototype.map.call(this.selectedPlayersGroup.get(1), (player: Player) => player.id);
    // let playerIdsGroupTwo: string = Array.prototype.map.call(this.selectedPlayersGroup.get(2), (player: Player) => player.id);
    // let playerIdsGroupThree: string = Array.prototype.map.call(this.selectedPlayersGroup.get(3), (player: Player) => player.id);
    // let playerIdsGroupFour: string = Array.prototype.map.call(this.selectedPlayersGroup.get(4), (player: Player) => player.id);

    // console.log("1st group: " + playerIdsGroupOne);
    // console.log("2nd group: " + playerIdsGroupTwo);
    // console.log("3rd group: " + playerIdsGroupThree);
    // console.log("4th group: " + playerIdsGroupFour);

    let params = new HttpParams()
      .set("roundNumber", this.roundNumber.toString())
      .set("roundDate", dateFormatted)
      .set("seasonUuid", this.seasonUuid);

    for (let i = 1; i <= this.numberOfGroups; i++) {

      let currentGroupSelectedPlayers: Player[] = this.selectedPlayersGroup.get(i);
      let currentGroupPlayerIds: string = "";
      for (let player of this.players) {
        if (currentGroupSelectedPlayers.includes(player)) {
          currentGroupPlayerIds += player.id + ",";
        }
      }
      currentGroupPlayerIds = currentGroupPlayerIds.substring(0, currentGroupPlayerIds.length-1);
      console.log("current: " + currentGroupPlayerIds)

      console.log(i + " group: " + currentGroupPlayerIds);
      params = params.append("playersIds", currentGroupPlayerIds);
    }

    console.log(params);

    this.http.post<string>(environment.apiUrl + 'rounds', params).subscribe(
      result => {
        let newRoundUuid: string = result;
        console.log("UUID of just created round: " + result);
        this.router.navigate(['round', newRoundUuid]);
      }
    );
  }

}
