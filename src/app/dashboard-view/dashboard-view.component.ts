import {Component, OnInit} from '@angular/core';
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {HttpClient} from "@angular/common/http";
import {Title} from "@angular/platform-browser";
import {RoundScoreboard} from "../shared/rest-api-dto/round-scoreboard.model";
import {RoundGroupScoreboard} from "../shared/rest-api-dto/round-group-scoreboard.model";
import {Utils} from "../shared/utils";
import {PlayerSummary} from "../shared/rest-api-dto/player-summary.model";
import {TrophiesWonForLeague} from "../shared/rest-api-dto/trophies-won-for-league.model";

@Component({
    selector: 'app-dashboard-view',
    templateUrl: './dashboard-view.component.html',
    styleUrls: ['./dashboard-view.component.css']
})
export class DashboardViewComponent implements OnInit {

    utils: Utils
    currentPlayer: PlayerDetailed;
    mostRecentRoundScoreboard: RoundScoreboard;
    playerSummary: PlayerSummary;
    trophies: TrophiesWonForLeague[];
    isRoundLoading: boolean;
    isSummaryLoading: boolean;
    isTrophiesLoading: boolean;
    noRoundsPlayed: boolean
    noTrophiesWon: boolean
    uuid: string

    constructor(private http: HttpClient,
                private titleService: Title) {
        this.utils = new Utils();
        this.titleService.setTitle('Dashboard');

        this.isRoundLoading = true;
        this.isSummaryLoading = true;
        this.isTrophiesLoading = true;

        this.noRoundsPlayed = false;
        this.noTrophiesWon = false;
    }

    ngOnInit(): void {
        this.http
            .get<PlayerDetailed>(environment.apiUrl + 'players/me')
            .pipe(map((result) => plainToClass(PlayerDetailed, result)))
            .subscribe(
                result => {
                    this.currentPlayer = result
                    this.initializeSubcomponents();
                });
    }

    initializeSubcomponents() {
        this.http
            .get<RoundScoreboard>(environment.apiUrl + 'scoreboards/most-recent-round/' + this.currentPlayer.uuid)
            .pipe(map(result => plainToClass(RoundScoreboard, result)))
            .subscribe(result => {
                this.mostRecentRoundScoreboard = result;
                if (!this.mostRecentRoundScoreboard) {
                    this.noRoundsPlayed = true;
                }
                this.isRoundLoading = false;
            });

        this.http
            .get<PlayerSummary>(environment.apiUrl + 'players-scoreboards/me-against-all')
            .pipe(map((result) => plainToClass(PlayerSummary, result)))
            .subscribe(
                result => {
                    this.playerSummary = result
                    this.isSummaryLoading = false;
                });

        this.http
            .get<TrophiesWonForLeague[]>(environment.apiUrl + 'hall-of-fame/' + this.currentPlayer.uuid)
            .pipe(map((result) => plainToClass(TrophiesWonForLeague, result)))
            .subscribe(
                result => {
                    this.trophies = result
                    if (this.trophies.length === 0) {
                        this.noTrophiesWon = true;
                    }
                    this.isTrophiesLoading = false;
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

}
