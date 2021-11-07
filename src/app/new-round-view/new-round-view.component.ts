import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Player} from '../shared/rest-api-dto/player.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {formatDate} from '@angular/common';
import {Season} from '../shared/rest-api-dto/season.model';
import {Title} from '@angular/platform-browser';
import {XpPointsPerRound} from '../shared/rest-api-dto/xp-points-per-round.model';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {SeasonScoreboard} from "../shared/rest-api-dto/season-scoreboard.model";
import {SeasonStar} from "../shared/rest-api-dto/season-star.model";
import {SeasonScoreboardRow} from "../shared/rest-api-dto/season-scoreboard-row.model";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-new-round-view',
  templateUrl: './new-round-view.component.html',
  styleUrls: ['./new-round-view.component.css'],
})
export class NewRoundViewComponent implements OnInit {

  seasonUuid: string;
  roundNumber: number;
  seasonNumber: number;
  leagueName: string;
  season: Season;
  leagueLogoBytes: string

  seasonScoreboard: SeasonScoreboard;
  numberOfGroups = 4;
  availableNumberOfGroups: number[] = [];
  selectedPlayersGroup: Map<number, Player[]> = new Map();
  roundDate: Date = new Date();

  xpPointsPerRound: XpPointsPerRound[];
  availableSplits: string[] = [];
  currentSplit: string;

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private loggerService: MyLoggerService,
              private router: Router,
              private titleService: Title,
              private translateService: TranslateService) {

    this.route.queryParams.subscribe((params) => {
      this.seasonUuid = params.seasonUuid;
      this.roundNumber = params.roundNumber;
    });

    this.http
    .get<Season>(this.apiEndpointsService.getSeasonByUuid(this.seasonUuid))
    .pipe(map((result) => plainToClass(Season, result)))
    .subscribe((result) => {
      this.season = result;
      this.seasonNumber = this.season.seasonNumber;
      this.leagueName = this.season.leagueName;
      this.http
      .get<XpPointsPerRound[]>(this.apiEndpointsService.getAllXpPointsOfType(this.season.xpPointsType))
      .pipe(map((result) => plainToClass(XpPointsPerRound, result)))
      .subscribe((result) => {
        this.xpPointsPerRound = result;
        this.xpPointsPerRound.forEach((xpPoints) => {
          this.availableSplits.push(xpPoints.split);
        });
      });
    });

    for (let i = 1; i <= this.numberOfGroups; i++) {
      this.availableNumberOfGroups.push(i)
      this.selectedPlayersGroup.set(i, []);
    }

    this.http
    .get<SeasonScoreboard>(this.apiEndpointsService.getSeasonScoreboardByUuid(this.seasonUuid))
    .pipe(map((result) => plainToClass(SeasonScoreboard, result)))
    .subscribe((result) => {
      this.seasonScoreboard = result;

      // we still need to add players to the list that were not playing in any round of current season
      this.http
      .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.seasonScoreboard.season.leagueUuid))
      .pipe(map((result) => plainToClass(Player, result)))
      .subscribe((result) => {
        const allLeaguePlayers = result;
        const alreadyExistingPlayers: Player[] = this.seasonScoreboard.seasonScoreboardRows.map(row => row.player);
        const alreadyExistingPlayersUuids: string[] = alreadyExistingPlayers.map(player => player.uuid);
        for (const player of allLeaguePlayers) {
          if (alreadyExistingPlayersUuids.indexOf(player.uuid) < 0) {
            this.seasonScoreboard.seasonScoreboardRows.push(new SeasonScoreboardRow(player));
          }
        }
      });
    });

    this.http
    .get(this.apiEndpointsService.getLeagueLogoBySeasonUuid(this.seasonUuid), {responseType: 'text'})
    .subscribe((result) => {
      this.leagueLogoBytes = result;
    });
  }

  ngOnInit(): void {
    this.translateService
    .get('round.new.create')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
      this.loggerService.log(translation);
    });
  }

  onCheckboxChange(player: Player, groupNumber: number, selected: boolean): void {
    if (selected) {
      this.selectedPlayersGroup.get(groupNumber).push(player);
    } else {
      this.selectedPlayersGroup.set(
          groupNumber,
          this.selectedPlayersGroup.get(groupNumber).filter((item) => item !== player)
      );
    }
    this.buildSplitBasedOnSelections();
  }

  buildSplitBasedOnSelections(): void {
    const split = [];
    for (const [key, value] of this.selectedPlayersGroup) {
      if (value.length === 0) {
        break;
      } else {
        split.push(value.length);
      }
    }
    this.currentSplit = split.join(' | ');
  }

  isSelectionValid(): boolean {
    const isValidSplit = this.availableSplits.some((split) => split === this.currentSplit);
    const noOverlappingPlayers = this.checkNoOverlappingPlayers();
    const noEmptyGroupsInBetween = this.checkNoEmptyGroupsInBetween();
    return isValidSplit && noOverlappingPlayers && noEmptyGroupsInBetween;
  }

  checkNoEmptyGroupsInBetween(): boolean {
    const splitProper = [];
    for (const [key, value] of this.selectedPlayersGroup) {
      if (value.length === 0) {
        break;
      } else {
        splitProper.push(value.length);
      }
    }

    const splitGeneral = [];
    for (const [key, value] of this.selectedPlayersGroup) {
      splitGeneral.push(value.length);
    }

    return splitProper.reduce((a, b) => a + b, 0) === splitGeneral.reduce((a, b) => a + b, 0);
  }

  checkNoOverlappingPlayers(): boolean {
    let selectedPlayers = [];

    for (const [key, playersArray] of this.selectedPlayersGroup) {
      for (const player of playersArray) {
        selectedPlayers.push(player);
      }
    }

    return new Set(selectedPlayers).size === selectedPlayers.length;
  }

  sendCreateRoundRequest(): void {
    const dateFormatted: string = formatDate(this.roundDate, 'yyyy-MM-dd', 'en-US');

    let params = new HttpParams()
    .set('roundNumber', this.roundNumber.toString())
    .set('roundDate', dateFormatted)
    .set('seasonUuid', this.seasonUuid);

    for (let i = 1; i <= this.numberOfGroups; i++) {
      const currentGroupSelectedPlayers: Player[] = this.selectedPlayersGroup.get(i);
      let currentGroupSelectedPlayersUuids: string[] = [];
      for (const row of this.seasonScoreboard.seasonScoreboardRows) {
        const player: Player = row.player;
        if (currentGroupSelectedPlayers.includes(player)) {
          currentGroupSelectedPlayersUuids.push(player.uuid);
        }
      }
      params = params.append('playersUuids', currentGroupSelectedPlayersUuids.toString());
    }

    this.http
    .post<string>(this.apiEndpointsService.getRounds(), params)
    .subscribe((roundUuid) => {
      this.router.navigate(['round', roundUuid]);
    });
  }

  getStarForPlayer(playerUuid: string): SeasonStar {
    return  this.seasonScoreboard.seasonStars[playerUuid];
  }
}
