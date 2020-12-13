import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SeasonScoreboard} from '../shared/rest-api-dto/season-scoreboard.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {SeasonScoreboardRow} from '../shared/rest-api-dto/season-scoreboard-row.model';
import {Title} from '@angular/platform-browser';
import {environment} from 'src/environments/environment';
import {formatDate} from '@angular/common';
import {Subject} from 'rxjs';
import {ApiEndpointsService} from "../shared/api-endpoints.service";

@Component({
    selector: 'app-season-view',
    templateUrl: './season-view.component.html',
    styleUrls: ['./season-view.component.css'],
})
export class SeasonViewComponent implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    displayedColumns: string[] = [
        'position',
        'player',
        'r1',
        'r2',
        'r3',
        'r4',
        'r5',
        'r6',
        'r7',
        'r8',
        'r9',
        'r10',
        'totalPoints',
        'countedPoints',
        'attendices',
        'average',
        'bonusPoints',
        'countedPointsPretenders',
    ];

    selectedType: string;
    showScoreboard = true;
    dataSource: MatTableDataSource<SeasonScoreboardRow>;
    uuid: string;
    seasonScoreboard: SeasonScoreboard;
    isLoading: boolean;
    noData: boolean

    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private titleService: Title) {

    }

    setupComponent(seasonUuid: string) {
        this.isLoading = true;
        this.noData = false;
        this.seasonScoreboard = null;
        this.uuid = seasonUuid;

        this.http
            .get<SeasonScoreboard>(this.apiEndpointsService.getSeasonScoreboardByUuid(this.uuid))
            .pipe(map((result) => plainToClass(SeasonScoreboard, result)))
            .subscribe(
                result => {
                    this.seasonScoreboard = result;

                    if (this.seasonScoreboard.rounds.length == 0) {
                        this.noData = true;
                    }

                    this.titleService.setTitle(
                        'Season ' +
                        this.seasonScoreboard.season.seasonNumber +
                        ' | ' +
                        this.seasonScoreboard.season.leagueName
                    );
                    this.dataSource = new MatTableDataSource(
                        this.seasonScoreboard.seasonScoreboardRows
                    );
                    this.dataSource.sort = this.sort;

                    this.dataSource.sortingDataAccessor = (item, property) => {
                        if (property.startsWith('r')) {
                            const roundNumber: number = Number(
                                property.substring(1)
                            );
                            return item.roundNumberToXpMapAll[roundNumber];
                        } else {
                            return item[property];
                        }
                    };
                    this.isLoading = false;
                },
                error => {
                    console.log(error);
                },
                () => {
                    this.isLoading = false;
                });
    }

    changeScoreboardView(type: string): void {
        this.selectedType = type;
    }

    dateFormatted(date: Date): string {
        return formatDate(date, 'dd.MM.yyyy', 'en-US');
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.setupComponent(params.uuid);
        });
        this.selectedType = "FULL";
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}
