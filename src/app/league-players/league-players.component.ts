import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Player } from '../shared/player.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Match } from '../shared/match.model';
import { PlayersScoreboard } from './model/players-scoreboard.model';

@Component({
  selector: 'app-league-players',
  templateUrl: './league-players.component.html',
  styleUrls: ['./league-players.component.css']
})
export class LeaguePlayersComponent implements OnInit {

  uid: number;
  players: Player[];
  selectedPlayers: Player[] = [];
  link: string;
  playersScoreboard: PlayersScoreboard;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.params.subscribe(params => this.uid = params["uid"]);
    console.log(this.uid);

    this.http.get<Player[]>('http://localhost:8080/leagues/' + this.uid + '/players-general')
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

  onChange(player: Player, selected: boolean): void {
    if (selected) {
      this.selectedPlayers.push(player)
    } else {
      this.selectedPlayers = this.selectedPlayers.filter(item => item !== player);
    }
    if (this.selectedPlayers.length > 0) {
      let commaSeparatedPlayersIds: string = Array.prototype.map.call(this.selectedPlayers, (player: Player) => player.id);
      this.link = "http://localhost:8080/scoreboards/leagues/" + this.uid + "/players/" + commaSeparatedPlayersIds;


    this.http.get<PlayersScoreboard>(this.link)
      .pipe(
        map(result => plainToClass(PlayersScoreboard, result)))
      .subscribe(result => {
        console.log(result);
        this.playersScoreboard = result;
        console.log("dupa");
      });


    } else {
      this.link = "No players selected";
    }
  }


}
