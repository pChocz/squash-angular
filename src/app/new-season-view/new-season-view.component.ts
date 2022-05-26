import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {League} from "../shared/rest-api-dto/league.model";
import {formatDate} from "@angular/common";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {FormControl, Validators} from "@angular/forms";
import {MyLoggerService} from "../shared/my-logger.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-new-season-view',
    templateUrl: './new-season-view.component.html',
    styleUrls: ['./new-season-view.component.css']
})
export class NewSeasonViewComponent implements OnInit {

    isLoading: boolean;

    descriptionField = new FormControl('',
        [Validators.maxLength(100)]
    );

    seasonNumberField = new FormControl('',
        [
            Validators.pattern(/^[0-9]\d*$/),
            Validators.min(1),
            Validators.max(1000),
        ]
    );

    leagueUuid: string;
    league: League;
    newSeasonDate: Date;
    xpPointsTypes: string[] = [];
    selectedXpPointsType: string;

    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private loggerService: MyLoggerService,
                private notificationService: NotificationService,
                private router: Router,
                private titleService: Title,
                private translateService: TranslateService) {
        this.newSeasonDate = new Date();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(
            params => {
                this.leagueUuid = params["leagueUuid"];
            });

        this.http
            .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.leagueUuid))
            .pipe(map((result) => plainToInstance(League, result)))
            .subscribe({
                next: (result) => {
                    this.league = result;
                    this.seasonNumberField.setValue(this.nextSeasonNumber());
                    this.translateService
                        .get('dynamicTitles.newSeason', {leagueName: this.league.leagueName})
                        .subscribe((translation: string) => {
                            this.titleService.setTitle(translation);
                            this.loggerService.log(translation);
                        });
                }
            });

        this.http
            .get<string[]>(this.apiEndpointsService.getXpPointsTypes())
            .subscribe((result) => {
                this.xpPointsTypes = result;
                this.selectedXpPointsType = result[0];
            });
    }

    nextSeasonNumber(): number {
        let numbers = this.league.seasons.map(season => season.seasonNumber);
        if (numbers.length == 0) {
            return 1;
        } else {
            return Math.max(...numbers) + 1;
        }
    }

    nextSeasonSoonestDate(): Date {
        let dates = this.league.seasons.map(x => new Date(x.seasonStartDate));
        let date = new Date(Math.max.apply(null, dates));
        date.setDate(date.getDate() + 1);
        return date;
    }

    createNewSeason(): void {
        this.isLoading = true;

        let params = new HttpParams()
            .set('seasonNumber', String(this.seasonNumberField.value))
            .set('startDate', formatDate(this.newSeasonDate, 'yyyy-MM-dd', 'en-US'))
            .set('leagueUuid', this.league.leagueUuid)
            .set('xpPointsType', this.selectedXpPointsType);

        if (this.descriptionField.value) {
            params = params.append('description', this.descriptionField.value);
        }

        this.http
            .post<string>(this.apiEndpointsService.getSeasons(), params)
            .subscribe({
                next: (seasonUuid) => {
                    this.notificationService.success('season.new.created');
                    this.router.navigate(['season', seasonUuid]);
                },
                error: (error) => {
                    this.isLoading = false;
                }
            });

    }

}
