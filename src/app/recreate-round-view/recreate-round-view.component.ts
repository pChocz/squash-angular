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
import {RoundScoreboard} from "../shared/rest-api-dto/round-scoreboard.model";

@Component({
  selector: 'app-recreate-round-view',
  templateUrl: './recreate-round-view.component.html',
  styleUrls: ['./recreate-round-view.component.css'],
})
export class RecreateRoundViewComponent implements OnInit {

  // route params
  roundUuid: string;
  seasonUuid: string;

  roundScoreboard: RoundScoreboard;
  season: Season;
  leagueLogoBytes: string

  players: Player[];
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
              private router: Router,
              private titleService: Title,
              private translateService: TranslateService) {

    this.route.params.subscribe((params) => {
      this.seasonUuid = params.seasonUuid;
      this.roundUuid = params.roundUuid;
    });

    this.http
    .get<Season>(this.apiEndpointsService.getSeasonByUuid(this.seasonUuid))
    .pipe(map((result) => plainToClass(Season, result)))
    .subscribe((result) => {
      this.season = result;
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
    .get<RoundScoreboard>(this.apiEndpointsService.getRoundScoreboardByUuid(this.roundUuid))
    .pipe(map((result) => plainToClass(RoundScoreboard, result)))
    .subscribe((result) => {
      this.roundScoreboard = result;
      this.roundDate = this.roundScoreboard.roundDate;
    });

    this.http
    .get<Player[]>(this.apiEndpointsService.getLeaguePlayersBySeasonUuidSorted(this.seasonUuid))
    .pipe(map((result) => plainToClass(Player, result)))
    .subscribe((result) => {
      this.players = result;
      this.preselectPlayersBasedOnRound();
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

  sendRecreateRoundRequest(): void {

    this.roundScoreboard = null;

    let params = new HttpParams();

    for (let i = 1; i <= this.numberOfGroups; i++) {
      const currentGroupSelectedPlayers: Player[] = this.selectedPlayersGroup.get(i);
      let currentGroupSelectedPlayersUuids: string[] = [];
      for (const player of this.players) {
        if (currentGroupSelectedPlayers.includes(player)) {
          currentGroupSelectedPlayersUuids.push(player.uuid);
        }
      }
      params = params.append('playersUuids', currentGroupSelectedPlayersUuids.toString());
    }

    console.log(params);

    this.http
    .put<string>(this.apiEndpointsService.getRoundsWithUuid(this.roundUuid),
        {},
        {
          params: params,
        })
    .subscribe(() => {
      this.router.navigate(['round',this.roundUuid]);
    });
  }

  private preselectPlayersBasedOnRound(): void {

  }

}
