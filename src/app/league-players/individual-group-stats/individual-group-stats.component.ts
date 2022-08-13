import {Component, Input, OnInit} from '@angular/core';
import {League} from "../../shared/rest-api-dto/league.model";
import {Player} from "../../shared/rest-api-dto/player.model";
import {PlayersScoreboard} from "../../shared/rest-api-dto/players-scoreboard.model";
import {MatchesPaginated} from "../../shared/rest-api-dto/matches-paginated.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {MyLoggerService} from "../../shared/my-logger.service";
import {environment} from "../../../environments/environment";
import {NotificationService} from "../../shared/notification.service";
// import {DateHelper} from "../../shared/date-helper";

@Component({
    selector: 'app-individual-group-stats',
    templateUrl: './individual-group-stats.component.html',
    styleUrls: ['./individual-group-stats.component.css']
})
export class IndividualGroupStatsComponent implements OnInit {

    @Input() league: League;
    @Input() players: Player[];

    // selectedRangeStart: Date;
    // selectedRangeEnd: Date;

    selectionMap: Map<Player, boolean>;
    selectedSeasonUuid: string;
    selectedGroupNumber: number;
    selectedAdditionalMatches: boolean;

    selectedPlayersUuids: string[];
    selectedPlayers: Player[] = [];
    playersScoreboard: PlayersScoreboard;

    matchesSimplePaginated: MatchesPaginated;

    allChecked: boolean;
    noMatchesPlayed: boolean;

    isLoading: boolean;

    constructor(private http: HttpClient,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private loggerService: MyLoggerService,
                private notificationService: NotificationService,
                private translateService: TranslateService,
                private titleService: Title,
                private location: Location,
                private apiEndpointsService: ApiEndpointsService) {
        this.selectionMap = new Map();
        this.selectedSeasonUuid = '0';
        this.selectedGroupNumber = 0;
        this.selectedAdditionalMatches = false;
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.season) {
                this.selectedSeasonUuid = params.season;
            }
            if (params.group) {
                this.selectedGroupNumber = params.group;
            }
            if (params.additional) {
                this.selectedAdditionalMatches = params.additional;
            }
            // if (params.dateFrom) {
            //     this.selectedRangeStart = DateHelper.dateUTC(params.dateFrom);
            // }
            // if (params.dateTo) {
            //     this.selectedRangeEnd = DateHelper.dateUTC(params.dateTo);
            // }
            if (params.players) {
                this.selectedPlayersUuids = params.players.split(',');
                this.players.forEach((player) => {
                    const isSelected = this.selectedPlayersUuids.includes(player.uuid);
                    this.selectionMap.set(player, isSelected)
                });
            } else {
                this.players.forEach((player) => {
                    this.selectionMap.set(player, false)
                });
            }

            this.updateComponent();
        });
    }


    onChange(player: Player, selected: boolean): void {
        this.selectionMap.set(player, selected);
        this.updateComponent();
    }

    // onDateChange(): void {
    //     this.selectedSeasonUuid = '0';
    //     this.updateComponent();
    // }

    onSeasonSelectChange(newValue: string): void {
        // this.selectedRangeStart = null;
        // this.selectedRangeEnd = null;
        this.selectedSeasonUuid = newValue;
        this.updateComponent();
    }

    onGroupSelectChange(newValue: number): void {
        this.selectedGroupNumber = newValue;
        this.updateComponent();
    }

    onAdditionalMatchesSelectChange(newValue: boolean): void {
        if (this.selectedAdditionalMatches !== newValue) {
            this.selectedAdditionalMatches = !this.selectedAdditionalMatches;
        }
        this.updateComponent();
    }

    selectAll(): void {
        for (const [key, value] of this.selectionMap) {
            this.selectionMap.set(key, true);
        }
        this.updateComponent();
    }

    deselectAll(): void {
        for (const [key, value] of this.selectionMap) {
            this.selectionMap.set(key, false);
        }
        this.updateComponent();
    }

    updateComponent(): void {
        this.isLoading = true;
        this.playersScoreboard = null;
        this.noMatchesPlayed = false;
        this.selectedPlayers = [];

        for (const [key, value] of this.selectionMap) {
            if (value) {
                this.selectedPlayers.push(key);
            }
        }

        if (this.selectedPlayers.length > 0) {
            this.selectedPlayersUuids = this.selectedPlayers.map(player => player.uuid);

            let params = {
                season: this.selectedSeasonUuid,
                group: this.selectedGroupNumber.toString(),
                additional: this.selectedAdditionalMatches,
                players: this.selectedPlayersUuids.join(',')
                // dateFrom: DateHelper.dateTimezoneAgnostic(this.selectedRangeStart),
                // dateTo: DateHelper.dateTimezoneAgnostic(this.selectedRangeEnd)
            }
            if (params.season === '0') {
                params.season = null;
            }
            if (params.group === '0') {
                params.group = null;
            }
            if (params.additional === false) {
                params.additional = null;
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


            let httpParams = new HttpParams();
            httpParams = httpParams.append('includeAdditionalMatches', this.selectedAdditionalMatches);
            if (this.selectedSeasonUuid !== '0') {
                httpParams = httpParams.append('seasonUuid', this.selectedSeasonUuid);
            }
            if (this.selectedGroupNumber > 0) {
                httpParams = httpParams.append('groupNumber', String(this.selectedGroupNumber));
            }
            // if (this.selectedRangeStart) {
            //     httpParams = httpParams.append('dateFrom', DateHelper.dateTimezoneAgnostic(this.selectedRangeStart));
            // }
            // if (this.selectedRangeEnd) {
            //     httpParams = httpParams.append('dateTo', DateHelper.dateTimezoneAgnostic(this.selectedRangeEnd));
            // }

            this.http
                .get<PlayersScoreboard>(this.apiEndpointsService.getSelectedPlayersScoreboardForLeague(this.league.leagueUuid, this.selectedPlayersUuids), {params: httpParams})
                .pipe(map((result) => plainToInstance(PlayersScoreboard, result)))
                .subscribe((result) => {
                    this.playersScoreboard = result;

                    this.translateService
                        .get('player.plural')
                        .subscribe((translation: string) => {
                            let title: string = translation + ' | ' + this.league.leagueName;
                            if (result.numberOfMatches > 0) {
                                title += ' | ' + this.playersScoreboard.extractPlayerNames();
                            }
                            this.titleService.setTitle(title);
                            this.loggerService.log(title);
                        });

                    if (this.playersScoreboard.numberOfMatches === 0) {
                        this.noMatchesPlayed = true;
                        this.playersScoreboard = null;
                    }
                    this.isLoading = false;
                });
        } else {
            const url = this.router.createUrlTree(
                [],
                {
                    relativeTo: this.activatedRoute,
                })
                .toString()
            this.location.go(url);
            this.isLoading = false;
        }
    }

    showCopyStats() {
        this.notificationService.success('stats.players.linkCopied');
    }

    buildCurrentUrl() {
        return environment.frontendUrl.slice(0, -1) + this.location.path();
    }

    clearFilters(): void {
        this.selectedSeasonUuid = '0';
        this.selectedGroupNumber = 0;
        this.selectedAdditionalMatches = false;
        // this.selectedRangeStart = null;
        // this.selectedRangeEnd = null;
        this.updateComponent();
    }
}
