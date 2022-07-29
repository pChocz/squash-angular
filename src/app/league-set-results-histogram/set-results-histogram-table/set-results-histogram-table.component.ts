import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SetResultsHistogram} from "../../shared/rest-api-dto/set-results-histogram.model";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {SetResultPlayer} from "../../shared/rest-api-dto/set-result-player.model";
import {SetResult} from "../../shared/rest-api-dto/set-result.model";

@Component({
    selector: 'app-set-results-histogram-table',
    templateUrl: './set-results-histogram-table.component.html',
    styleUrls: ['./set-results-histogram-table.component.css']
})
export class SetResultsHistogramTableComponent implements OnInit {

    winTypes: string[] = [
        'ALL',
        'WON',
        'LOST'
    ];

    maxScores: number[] = [
        -1
    ];

    winType: string = 'ALL';
    maxScore: number = -1;

    maxCount: Map<number, number>;

    @Input() setResultsHistogram: SetResultsHistogram;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    displayedColumns: string[] = [
        'index',
        'player'
    ];

    dataSource: MatTableDataSource<SetResultPlayer>;

    constructor() {

    }

    ngOnInit(): void {
        this.displayedColumns.push(...this.setResultsHistogram.uniqueResults.map(v => v.result))
        this.displayedColumns.push('total')

        this.maxScores.push(...new Set(this.setResultsHistogram.uniqueResults.map(v => v.greatest)))

        this.dataSource = new MatTableDataSource(this.setResultsHistogram.setResultsPlayers);
        this.dataSource.sort = this.sort;

        this.dataSource.sortingDataAccessor = (item, property) => {
            return item.getCountForResultAsString(property);
        };

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
        let r = 255 - Math.floor(count / this.maxCount.get(item.greatest) * 255);
        let g = 255;
        let b = 255 - Math.floor(count / this.maxCount.get(item.greatest) * 255);
        let a = 0.6;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }
}
