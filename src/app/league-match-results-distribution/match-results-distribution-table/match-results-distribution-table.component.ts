import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LeagueMatchResultDistribution} from "../../shared/rest-api-dto/league-match-result-distribution.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {PlayerMatchResultDistribution} from "../../shared/rest-api-dto/player-match-result-distribution.model";
import {Player} from "../../shared/rest-api-dto/player.model";
import {Globals} from "../../globals";
import {OpponentMatchResultDistribution} from "../../shared/rest-api-dto/opponent-match-result-distribution.model";

@Component({
    selector: 'app-match-results-distribution-table',
    templateUrl: './match-results-distribution-table.component.html',
    styleUrls: ['./match-results-distribution-table.component.css']
})
export class MatchResultsDistributionTableComponent implements OnInit {

    @Input() matchResultDistribution: LeagueMatchResultDistribution;
    leagueUuid: string;
    selectionMap: Map<number, boolean>;
    includeAdditional: boolean;

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource: MatTableDataSource<PlayerMatchResultDistribution>;
    displayedColumns: string[];

    constructor(private apiEndpointsService: ApiEndpointsService,
                private http: HttpClient) {
    }

    ngOnInit(): void {
        this.leagueUuid = this.matchResultDistribution.league.leagueUuid;
        this.selectionMap = new Map();
        this.includeAdditional = true;
        this.updateTable();
    }

    onSeasonChange(seasonNumber: number, $event: any) {
        this.selectionMap.set(seasonNumber, $event);

        let selectedSeasonNumbers: number[] = [];
        for (const [key, value] of this.selectionMap) {
            if (value) {
                selectedSeasonNumbers.push(key);
            }
        }

        this.http
            .get<LeagueMatchResultDistribution>(this.apiEndpointsService.getLeagueMatchResultsDistribution(this.leagueUuid, this.includeAdditional ,selectedSeasonNumbers))
            .pipe(map((result) => plainToInstance(LeagueMatchResultDistribution, result)))
            .subscribe((result) => {
                this.matchResultDistribution = result;
                this.updateTable();
            });
    }

    onIncludeAdditionalChange($event: any) {
        this.includeAdditional = $event;

        let selectedSeasonNumbers: number[] = [];
        for (const [key, value] of this.selectionMap) {
            if (value) {
                selectedSeasonNumbers.push(key);
            }
        }

        this.http
            .get<LeagueMatchResultDistribution>(this.apiEndpointsService.getLeagueMatchResultsDistribution(this.leagueUuid, this.includeAdditional, selectedSeasonNumbers))
            .pipe(map((result) => plainToInstance(LeagueMatchResultDistribution, result)))
            .subscribe((result) => {
                this.matchResultDistribution = result;
                this.updateTable();
            });
    }

    updateTable(): void {
        this.displayedColumns = [];
        this.displayedColumns.push('player-left');
        this.displayedColumns.push(...this.extractPlayers());
        this.displayedColumns.push('total');

        this.dataSource = new MatTableDataSource(this.matchResultDistribution.playerMatchResultDistributionList);
    }

    findPlayerByUsername(username: string): Player {
        return this.matchResultDistribution
            .playerMatchResultDistributionList
            .filter(v => v.player.username === username)
            .pop()
            .player;
    }

    countAllMatchesWon(): number {
        return this.matchResultDistribution
            .playerMatchResultDistributionList
            .map(v => v.opponentMatchResultDistributionList)
            .reduce((acc, curr) => {
                return acc + curr.reduce((a, b) => a + b.matchesWon, 0)
            }, 0);
    }

    countLostMatchesForPlayer(username: string) {
        for (let v of this.matchResultDistribution.playerMatchResultDistributionList) {
            if (v.player.username === username) {
                return v.matchesLost
            }
        }
        return null;
    }

    countRatioForPlayer(username: string) {
        for (let v of this.matchResultDistribution.playerMatchResultDistributionList) {
            if (v.player.username === username) {
                return v.matchesRatio
            }
        }
        return null;
    }

    calculateColor(row: PlayerMatchResultDistribution, item: string) {
        let opponentMatchResultDistribution: OpponentMatchResultDistribution = row.opponentMatchResultDistributionList
            .filter(v => v.opponent.username === item)
            .pop();

        if (!opponentMatchResultDistribution) {
            return '';
        }

        let matchesWon = opponentMatchResultDistribution.matchesWon;
        let matchesLost = opponentMatchResultDistribution.matchesLost;
        let allMatches = matchesWon + matchesLost;

        if (matchesWon === 0 && matchesLost === 0) {
            return '';
        }

        let percentWon = matchesWon / allMatches;

        let cookieTheme = localStorage.getItem(Globals.STORAGE_THEME_KEY);
        let r;
        let g;
        let b;
        let a = 0.3;
        if (cookieTheme === Globals.DARK_MODE) {
            // rgb 48 48 48 - dark mode background
            if (percentWon > 0.5) {
                r = 48;
                g = 48 + Math.floor((percentWon * 2) * 200) / 2;
                b = 48;
            } else {
                r = 255;
                g = 48 + Math.floor((percentWon * 2) * 200) / 2;
                b = 48;
            }
        } else {
            if (percentWon > 0.5) {
                r = Math.floor(255 - (percentWon * 2 - 1) * 255) / 2;
                g = 255;
                b = 50;
            } else {
                r = 255;
                g = Math.floor((percentWon * 2) * 255) / 2;
                b = 50;
            }
        }
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    private extractPlayers(): string[] {
        return this.matchResultDistribution
            .playerMatchResultDistributionList
            .map(v => v.player.username);
    }

}
