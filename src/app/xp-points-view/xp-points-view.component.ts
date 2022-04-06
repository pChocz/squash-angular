import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {XpPointsPerRound} from '../shared/rest-api-dto/xp-points-per-round.model';
import {map} from 'rxjs/operators';
import {plainToInstance} from 'class-transformer';
import {Title} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-xp-points-view',
    templateUrl: './xp-points-view.component.html',
    styleUrls: ['./xp-points-view.component.css'],
})
export class XpPointsViewComponent implements OnInit, OnDestroy {

    destroy$: Subject<boolean> = new Subject<boolean>();

    displayedStaticColumns: string[] = [
        'type',
        'split',
        'numberOfPlayers'
    ];

    displayedNumericPerPlaceColumns: string[];
    displayedAllColumns: string[] = [];
    xpPointsPerRound: XpPointsPerRound[];
    dataSource: MatTableDataSource<XpPointsPerRound>;
    types: string[] = [];
    selectedType: string;

    isLoading: boolean;

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private loggerService: MyLoggerService,
                private titleService: Title,
                private route: ActivatedRoute,
                private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.isLoading = true;

        this.translateService
            .get('xpPoints.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
                this.loggerService.log(translation);
            });

        this.http
            .get<XpPointsPerRound[]>(this.apiEndpointsService.getAllXpPoints())
            .pipe(map(result => plainToInstance(XpPointsPerRound, result)))
            .subscribe({
                next: (result) => {
                    this.xpPointsPerRound = result;
                    this.dataSource = new MatTableDataSource(this.xpPointsPerRound);
                    const maxNumberOfPlayers: number = Math.max.apply(
                        Math,
                        this.xpPointsPerRound.map(function (o) {
                            return o.numberOfPlayers;
                        })
                    )
                    this.displayedNumericPerPlaceColumns = [];
                    for (let i = 1; i <= maxNumberOfPlayers; i++) {
                        this.displayedNumericPerPlaceColumns.push(i.toString());
                    }
                    this.displayedAllColumns = this.displayedAllColumns.concat(this.displayedStaticColumns);
                    this.displayedAllColumns = this.displayedAllColumns.concat(this.displayedNumericPerPlaceColumns);

                    for (let xpPoints of this.xpPointsPerRound) {
                        let type = xpPoints.type;
                        if (this.types.indexOf(type) === -1) {
                            this.types.push(type);
                        }
                    }
                    this.route
                        .queryParams
                        .subscribe(params => {
                            let typeQueryParam = params['type'];
                            if (typeQueryParam) {
                                this.selectedType = typeQueryParam;
                            } else {
                                this.selectedType = this.types[0];
                            }
                        });
                    this.dataSource.filter = this.selectedType;

                },
                error: (error) => {
                    this.loggerService.log(error, false);
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
    }

    public doFilter(): void {
        this.dataSource.filter = this.selectedType;
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

}
