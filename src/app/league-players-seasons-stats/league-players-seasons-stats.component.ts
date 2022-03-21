import { Component, OnInit } from '@angular/core';
import {League} from "../shared/rest-api-dto/league.model";
import {Player} from "../shared/rest-api-dto/player.model";
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {map} from "rxjs/operators";
import {plainToClass, plainToInstance} from "class-transformer";
import {PlayerAllSeasonsStats} from "../shared/rest-api-dto/player-all-seasons-stats.model";

@Component({
  selector: 'app-league-players-seasons-stats',
  templateUrl: './league-players-seasons-stats.component.html',
  styleUrls: ['./league-players-seasons-stats.component.css']
})
export class LeaguePlayersSeasonsStatsComponent implements OnInit {

  locale: string;

  leagueUuid: string;
  league: League;
  players: Player[];

  selectedPlayer: Player;
  stats: PlayerAllSeasonsStats;

  leagueLoading: boolean;
  statsLoading: boolean;
  noStatsAvailable: boolean;

  constructor(private loggerService: MyLoggerService,
              private translateService: TranslateService,
              private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title) {
    this.leagueLoading = true;
    this.locale = this.translateService.currentLang;

  }

  ngOnInit(): void {
    this.route
        .params
        .subscribe((params) => {
          this.leagueUuid = params.uuid

          this.http
              .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.leagueUuid))
              .pipe(map((result) => plainToInstance(League, result)))
              .subscribe((result) => {
                this.league = result;
                this.leagueLoading = false;

                this.http
                    .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.leagueUuid))
                    .pipe(map((result) => plainToInstance(Player, result)))
                    .subscribe((result) => {
                      this.players = result;

                      this.route
                          .queryParams
                          .subscribe((params) => {
                            if (params.player) {
                              this.selectedPlayer = this.players.filter(player => player.uuid === params.player).pop();
                              this.loadStatsForPlayer(this.selectedPlayer);

                            } else {
                              this.selectedPlayer = null;
                              this.stats = null;
                              this.setTitleLeagueOnly();
                            }
                          });
                    });
              });
        })
  }


  buildUrlStringAndGo(selectedPlayer: Player) {
    let params = {
      player: selectedPlayer.uuid
    }
    const url = this.router.createUrlTree(
        [],
        {
          relativeTo: this.route,
          queryParams: params,
          queryParamsHandling: 'merge'
        })
        .toString()
    this.location.go(url);
  }

  loadStatsForPlayerAndGo(selectedPlayer: Player) {
    this.buildUrlStringAndGo(selectedPlayer);
    this.loadStatsForPlayer(selectedPlayer);
  }

  loadStatsForPlayer(selectedPlayer: Player) {
    this.stats = null;
    this.statsLoading = true;
    this.noStatsAvailable = false;

    this.http
        .get<PlayerAllSeasonsStats>(this.apiEndpointsService.getPlayerSeasonsStats(this.leagueUuid, selectedPlayer.uuid))
        .pipe(map((result) => plainToClass(PlayerAllSeasonsStats, result)))
        .subscribe(
            result => {
              this.stats = result;
              let seasonsPlayed = this.stats.playerSingleSeasonStats.length;

              if (seasonsPlayed > 0) {
                this.setTitleLeagueAndPlayer();

              } else {
                this.noStatsAvailable = true;
              }
            },
            error => {
              console.log(error);
              this.noStatsAvailable = true;
            },
            () => {
              this.statsLoading = false;
            });
  }



  private setTitleLeagueOnly() {
    this.translateService
        .get('stats.tabs.seasons')
        .subscribe((translation: string) => {
          let title: string = translation + " | " + this.league.leagueName;
          this.titleService.setTitle(title);
          this.loggerService.log(title);
        });
  }

  private setTitleLeagueAndPlayer() {
    this.translateService
        .get('stats.tabs.seasons')
        .subscribe((translation: string) => {
          let title: string = translation + ' | ' + this.league.leagueName + ' | ' + this.selectedPlayer.username;
          this.titleService.setTitle(title);
          this.titleService.setTitle(title);
          this.loggerService.log(title);
        });
  }


}
