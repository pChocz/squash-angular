import {Component, Input, OnInit} from '@angular/core';
import {League} from "../../shared/rest-api-dto/league.model";
import {Player} from "../../shared/rest-api-dto/player.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PlayersScoreboard} from "../../shared/rest-api-dto/players-scoreboard.model";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {PlayerSingleRoundsStats} from "../../shared/rest-api-dto/player-single-rounds-stats.model";
import {environment} from "../../../environments/environment";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-rounds-stats',
  templateUrl: './rounds-stats.component.html',
  styleUrls: ['./rounds-stats.component.css']
})
export class RoundsStatsComponent implements OnInit {

  @Input() league: League;
  @Input() players: Player[];
  selectedPlayer: Player;


  stats: PlayerSingleRoundsStats[];

  isLoading: boolean;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  loadStatsForPlayer(selectedPlayer: Player) {
    let httpParams = new HttpParams()
        .append('leagueUuid', this.league.leagueUuid)
        .append('playerUuid', selectedPlayer.uuid);

    this.http
        .get<PlayerSingleRoundsStats[]>(environment.apiUrl +'players-scoreboards/rounds-stats', {params: httpParams})
        .pipe(map((result) => plainToClass(PlayerSingleRoundsStats, result)))
        .subscribe((result) => {
          this.stats = result;
          console.log(this.stats);
          this.isLoading = false;
        });
  }

}
