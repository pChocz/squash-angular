import {Component, OnInit} from '@angular/core';
import {League} from "../shared/rest-api-dto/league.model";
import {Player} from "../shared/rest-api-dto/player.model";
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerAllRoundsStats} from "../shared/rest-api-dto/player-all-rounds-stats.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-league-player-rounds-stats',
  templateUrl: './league-player-rounds-stats.component.html',
  styleUrls: ['./league-player-rounds-stats.component.css']
})
export class LeaguePlayerRoundsStatsComponent implements OnInit {

  leagueUuid: string;

  league: League;
  players: Player[];

  selectedPlayer: Player;

  stats: PlayerAllRoundsStats;

  isLoading: boolean;
  noStatsAvailable: boolean;

  constructor(private loggerService: MyLoggerService,
              private translateService: TranslateService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private location: Location,
              private route: ActivatedRoute,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.route
    .params
    .subscribe((params) => (this.leagueUuid = params.uuid));

    this.http
    .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.leagueUuid))
    .pipe(map((result) => plainToClass(League, result)))
    .subscribe((result) => {
      this.league = result;

      this.translateService
      .get('stats.tabs.rounds')
      .subscribe((translation: string) => {
        this.titleService.setTitle(translation + " | " + this.league.leagueName);
      });
    });

    this.http
    .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.leagueUuid))
    .pipe(map((result) => plainToClass(Player, result)))
    .subscribe((result) => {
      this.players = result;
      this.activatedRoute
      .queryParams
      .subscribe(params => {
        if (params.player) {
          this.selectedPlayer = this.players.filter(player => player.uuid === params.player).pop();
          if (this.selectedPlayer !== null) {
            this.loadStatsForPlayer(this.selectedPlayer);
          } else {
            // clear query parameters
            const url = this.router.createUrlTree(
                [],
                {
                  relativeTo: this.activatedRoute,
                })
            .toString();
          }
        }
      });
    });
  }

  loadStatsForPlayer(selectedPlayer: Player) {
    let params = {
      player: this.selectedPlayer.uuid
    }
    const url = this.router.createUrlTree(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: params,
          queryParamsHandling: 'merge'
        })
    .toString()
    this.location.go(url);

    this.stats = null;
    this.isLoading = true;
    this.noStatsAvailable = false;

    this.http
    .get<PlayerAllRoundsStats>(this.apiEndpointsService.getPlayerRoundsStats(this.league.leagueUuid, selectedPlayer.uuid))
    .pipe(map((result) => plainToClass(PlayerAllRoundsStats, result)))
    .subscribe(
        result => {
          this.stats = result;
          if (this.stats.playerSingleRoundStats.length > 0) {
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
