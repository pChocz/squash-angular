import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SetResultsHistogram} from "../../shared/rest-api-dto/set-results-histogram.model";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {SetResultPlayer} from "../../shared/rest-api-dto/set-result-player.model";
import {SetResult} from "../../shared/rest-api-dto/set-result.model";
import {Globals} from "../../globals";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-set-results-histogram-table',
    templateUrl: './set-results-histogram-table.component.html',
    styleUrls: ['./set-results-histogram-table.component.css']
})
export class SetResultsHistogramTableComponent implements OnInit {

    @Input() setResultsHistogram: SetResultsHistogram;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource: MatTableDataSource<SetResultPlayer>;

    winTypes: string[];
    winType: string;
    maxScore: number = -1;

    leagueUuid: string;
    maxCount: Map<number, number>;
    selectionMap: Map<number, boolean>;
    includeAdditional: boolean;
    maxScores: number[];
    displayedColumns: string[];

    constructor(private apiEndpointsService: ApiEndpointsService,
                private http: HttpClient) {

    }

    ngOnInit(): void {
        this.includeAdditional = true;
        if (this.setResultsHistogram.league) {
            this.winTypes = ['ALL', 'WON', 'LOST'];
            this.winType = 'ALL';
            this.leagueUuid = this.setResultsHistogram.league.leagueUuid;
            this.selectionMap = new Map();
            this.setResultsHistogram.league.seasons.forEach(s => this.selectionMap.set(s.seasonNumber, false));
        } else {
            this.winType = 'WON';
        }
        this.updateTable();
    }

    checkHidden(item: SetResult): boolean {
        let isScoreHidden = (this.maxScore === -1)
            ? false
            : (this.maxScore !== item.greatest);

        let isWinTypeHidden;
        switch (this.winType) {
            case 'WON': {
                isWinTypeHidden = item.first < item.second;
                break;
            }
            case 'LOST': {
                isWinTypeHidden = item.first > item.second;
                break;
            }
            default: {
                isWinTypeHidden = false;
                break;
            }
        }
        return isScoreHidden || isWinTypeHidden;
    }

    countTotalForSetResult(item: SetResult) {
        return this.setResultsHistogram.setResultsPlayers.map(t => t.getCountForResult(item)).reduce((a, b) => a + b, 0);
    }

    countTotalForPlayer(row: SetResultPlayer) {
        let total = 0;
        for (let setResultCount of row.setResultCounts) {
            if (!this.checkHidden(new SetResult(setResultCount.first, setResultCount.second, Math.max(setResultCount.first, setResultCount.second)))) {
                total += setResultCount.count;
            }
        }
        return total;
    }

    countTotal() {
        let total = 0;
        for (let setResultsPlayer of this.setResultsHistogram.setResultsPlayers) {
            for (let setResultCount of setResultsPlayer.setResultCounts) {
                if (!this.checkHidden(new SetResult(setResultCount.first, setResultCount.second, Math.max(setResultCount.first, setResultCount.second)))) {
                    total += setResultCount.count;
                }
            }
        }
        return this.winType === 'ALL'
            ? total / 2
            : total;
    }

    calculateColor(row: SetResultPlayer, item: SetResult) {
        let count = row.getCountForResult(item);
        if (count === null || count === 0) {
            return '';
        }
        let cookieTheme = localStorage.getItem(Globals.STORAGE_THEME_KEY);
        let r;
        let g;
        let b;
        let a = 0.6;
        if (cookieTheme === Globals.DARK_MODE) {
            // rgb 48 48 48 - dark mode background
            r = 48;
            g = 48 + Math.floor(count / this.maxCount.get(item.greatest) * 200);
            b = 48 + Math.floor(count / this.maxCount.get(item.greatest) * 200) / 2;
        } else {
            r = 255 - Math.floor(count / this.maxCount.get(item.greatest) * 255);
            g = 255;
            b = 255 - Math.floor(count / this.maxCount.get(item.greatest) * 255);
        }
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
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
            .get<SetResultsHistogram>(this.apiEndpointsService.getLeagueSetResultsHistogram(this.leagueUuid, this.includeAdditional, selectedSeasonNumbers))
            .pipe(map((result) => plainToInstance(SetResultsHistogram, result)))
            .subscribe((result) => {
                this.setResultsHistogram = result;
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
            .get<SetResultsHistogram>(this.apiEndpointsService.getLeagueSetResultsHistogram(this.leagueUuid, this.includeAdditional, selectedSeasonNumbers))
            .pipe(map((result) => plainToInstance(SetResultsHistogram, result)))
            .subscribe((result) => {
                this.setResultsHistogram = result;
                this.updateTable();
            });
    }

    private updateTable() {
        this.dataSource = new MatTableDataSource(this.setResultsHistogram.setResultsPlayers);
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item, property) => {
            return item.getCountForResultAsString(property);
        };


        this.displayedColumns = [];
        this.displayedColumns.push('player');
        this.displayedColumns.push(...this.setResultsHistogram.uniqueResults.map(v => v.result));
        this.displayedColumns.push('total');


        this.maxScores = [];
        this.maxScores.push(-1);
        this.maxScores.push(...new Set(this.setResultsHistogram.uniqueResults.map(v => v.greatest)))


        this.maxCount = new Map();
        this.maxScores.forEach(v => this.maxCount.set(v, 0));
        for (let setResultsPlayer of this.setResultsHistogram.setResultsPlayers) {
            for (let setResultCount of setResultsPlayer.setResultCounts) {
                let greatest = Math.max(setResultCount.first, setResultCount.second);
                if (setResultCount.count > this.maxCount.get(greatest)) {
                    this.maxCount.set(greatest, setResultCount.count);
                }
            }
        }
    }
}
