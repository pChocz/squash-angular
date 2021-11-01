import {Component, Input, OnInit} from '@angular/core';
import {League} from "../../shared/rest-api-dto/league.model";
import {Player} from "../../shared/rest-api-dto/player.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {PlayerSingleRoundsStats} from "../../shared/rest-api-dto/player-single-rounds-stats.model";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {MyLoggerService} from "../../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";

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
  noStatsAvailable: boolean;

  constructor(private loggerService: MyLoggerService,
              private translateService: TranslateService,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title) {
  }

  ngOnInit(): void {
  }

  loadStatsForPlayer(selectedPlayer: Player) {
    this.stats = null;
    this.isLoading = true;
    this.noStatsAvailable = false;

    this.http
    .get<PlayerSingleRoundsStats[]>(this.apiEndpointsService.getPlayerRoundsStats(this.league.leagueUuid, selectedPlayer.uuid))
    .pipe(map(result => plainToClass(PlayerSingleRoundsStats, result)))
    .subscribe(
        result => {
          if (result.length > 0) {
            this.stats = result;
            this.translateService
            .get('stats.tabs.rounds')
            .subscribe((translation: string) => {
              let title: string = translation + ' | ' + this.league.leagueName + ' | ' + selectedPlayer.username;
              this.titleService.setTitle(title);
              this.loggerService.log(title);
            });
          } else {
            this.noStatsAvailable = true;
          }
        },
        error => {
          console.log(error);
          this.noStatsAvailable = true;
        },
        () => {
          this.isLoading = false;
        });
  }

}
