import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Player} from '../shared/rest-api-dto/player.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {formatDate} from '@angular/common';
import {Season} from '../shared/rest-api-dto/season.model';
import {Title} from '@angular/platform-browser';
import {environment} from 'src/environments/environment';
import {XpPointsPerRound} from '../shared/rest-api-dto/xp-points-per-round.model';

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

    players: Player[];
    numberOfGroups = 3;
    maxNumberOfGroups = 4;
    availableNumberOfGroups: number[] = [];
    selectedPlayersGroup: Map<number, Player[]> = new Map();
    roundDate: Date = new Date();

    xpPointsPerRound: XpPointsPerRound[];
    availableSplits: string[] = [];
    currentSplit: string;

    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private router: Router,
                private titleService: Title
    ) {
        this.titleService.setTitle('New round');

        this.route.queryParams.subscribe((params) => {
            this.seasonUuid = params.seasonUuid;
            this.roundNumber = params.roundNumber;
        });

        this.http
            .get<XpPointsPerRound[]>(environment.apiUrl + 'xpPoints/all-for-table')
            .pipe(map((result) => plainToClass(XpPointsPerRound, result)))
            .subscribe((result) => {
                this.xpPointsPerRound = result;
                this.xpPointsPerRound.forEach((xpPoints) => {
                    this.availableSplits.push(xpPoints.split);
                });
            });

        this.http
            .get<Season>(environment.apiUrl + 'seasons/' + this.seasonUuid)
            .pipe(map((result) => plainToClass(Season, result)))
            .subscribe((result) => {
                this.season = result;
                this.seasonNumber = this.season.seasonNumber;
                this.leagueName = this.season.leagueName;
            });

        for (let i = 1; i <= this.maxNumberOfGroups; i++) {
            this.availableNumberOfGroups.push(i)
            this.selectedPlayersGroup.set(i, []);
        }

        this.http
            .get<Player[]>(environment.apiUrl + 'scoreboards/seasons/' + this.seasonUuid + '/players-sorted')
            .pipe(map((result) => plainToClass(Player, result)))
            .subscribe((result) => {
                this.players = result;
            });
    }

    ngOnInit(): void {
    }

    onNumberOfGroupsChange(value: number): void {
        for (let groupNumber = value + 1; groupNumber <= 4; groupNumber++) {
            this.selectedPlayersGroup.set(groupNumber, []);
        }
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
        return isValidSplit && noOverlappingPlayers;
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
            for (const player of this.players) {
                if (currentGroupSelectedPlayers.includes(player)) {
                    currentGroupSelectedPlayersUuids.push(player.uuid);
                }
            }
            params = params.append('playersUuids', currentGroupSelectedPlayersUuids.toString());
        }

        this.http
            .post<string>(environment.apiUrl + 'rounds', params)
            .subscribe((roundUuid) => {
                this.router.navigate(['round', roundUuid]);
            });
    }
}
