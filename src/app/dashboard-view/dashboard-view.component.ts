import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {map, takeUntil} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {RoundScoreboard} from "../shared/rest-api-dto/round-scoreboard.model";
import {RoundGroupScoreboard} from "../shared/rest-api-dto/round-group-scoreboard.model";
import {PlayerSummary} from "../shared/rest-api-dto/player-summary.model";
import {TrophiesWonForLeague} from "../shared/rest-api-dto/trophies-won-for-league.model";
import {Match} from "../shared/rest-api-dto/match.model";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs";
import {League} from "../shared/rest-api-dto/league.model";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit, OnDestroy {

  currentPlayer: PlayerDetailed;
  mostRecentRoundScoreboard: RoundScoreboard;
  playerSummary: PlayerSummary;
  trophies: TrophiesWonForLeague[];
  leagues: League[];
  isRoundLoading: boolean;
  isSummaryLoading: boolean;
  isTrophiesLoading: boolean;
  noRoundsPlayed: boolean
  noTrophiesWon: boolean
  noLeagues: boolean
  uuid: string
  private ngUnsubscribe = new Subject();

  // emojis: string[];

  constructor(private http: HttpClient,
              private loggerService: MyLoggerService,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title,
              private translateService: TranslateService) {

    this.isRoundLoading = true;
    this.isSummaryLoading = true;
    this.isTrophiesLoading = true;

    this.noRoundsPlayed = false;
    this.noTrophiesWon = false;
    this.noLeagues = false;
  }

  ngOnInit(): void {
    this.translateService
    .get('menu.dashboard')
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((res: string) => {
      this.titleService.setTitle(res);
      this.loggerService.log(res);
    });

    this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
    .pipe(
        map((result) => plainToClass(PlayerDetailed, result)),
        takeUntil(this.ngUnsubscribe)
    )
    .subscribe(
        result => {
          this.currentPlayer = result
          this.initializeSubcomponents();
        });

    // this.http
    // .get<string[]>(this.apiEndpointsService.getAllEmojis())
    // .subscribe((result) => {
    //   this.emojis = result;
    // });
  }

  initializeSubcomponents() {
    this.http
    .get<RoundScoreboard>(this.apiEndpointsService.getMostRecentRoundScoreboardForPlayerByUuid(this.currentPlayer.uuid))
    .pipe(
        map(result => plainToClass(RoundScoreboard, result)),
        takeUntil(this.ngUnsubscribe)
    )
    .subscribe(result => {
      this.mostRecentRoundScoreboard = result;
      if (!this.mostRecentRoundScoreboard) {
        this.noRoundsPlayed = true;
      }
      this.isRoundLoading = false;
    });

    this.http
    .get<PlayerSummary>(this.apiEndpointsService.getMeAgainstAllScoreboard())
    .pipe(
        map((result) => plainToClass(PlayerSummary, result)),
        takeUntil(this.ngUnsubscribe)
    )
    .subscribe(
        result => {
          this.playerSummary = result
          this.isSummaryLoading = false;
        });

    this.http
    .get<TrophiesWonForLeague[]>(this.apiEndpointsService.getTrophiesByPlayerUuid(this.currentPlayer.uuid))
    .pipe(
        map((result) => plainToClass(TrophiesWonForLeague, result)),
        takeUntil(this.ngUnsubscribe)
    )
    .subscribe(
        result => {
          this.trophies = result
          if (this.trophies.length === 0) {
            this.noTrophiesWon = true;
          }
          this.isTrophiesLoading = false;
        });

    this.http
    .get<League[]>(this.apiEndpointsService.getMyLeagues())
    .pipe(
        map((result) => plainToClass(League, result)),
        takeUntil(this.ngUnsubscribe)
    )
    .subscribe(
        result => {
          this.leagues = result
          if (this.leagues.length === 0) {
            this.noLeagues = true;
          }
        });
  }

  extractCorrectRoundGroup(): RoundGroupScoreboard {
    for (let roundGroup of this.mostRecentRoundScoreboard.roundGroupScoreboards) {
      for (let row of roundGroup.scoreboardRows) {
        if (row.player.uuid === this.currentPlayer.uuid) {
          return roundGroup;
        }
      }
    }
    return null;
  }

  extractMyMatches(): Match[] {
    let roundGroup = this.extractCorrectRoundGroup();
    return roundGroup
    .matches
    .filter(match =>
        match.firstPlayer.uuid === this.currentPlayer.uuid
        || match.secondPlayer.uuid === this.currentPlayer.uuid);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next('1');
    this.ngUnsubscribe.complete();
  }

}
