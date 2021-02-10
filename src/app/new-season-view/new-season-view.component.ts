import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {League} from "../shared/rest-api-dto/league.model";
import {formatDate} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Season} from "../shared/rest-api-dto/season.model";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-new-season-view',
    templateUrl: './new-season-view.component.html',
    styleUrls: ['./new-season-view.component.css']
})
export class NewSeasonViewComponent implements OnInit {

    leagueUuid: string;
    league: League;
    newSeasonDate: Date;

    constructor(private route: ActivatedRoute,
                private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private sanitizer: DomSanitizer,
                private snackBar: MatSnackBar,
                private router: Router,
                private titleService: Title,
                private translateService: TranslateService) {
        this.newSeasonDate = new Date();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(
            params => {
                this.leagueUuid = params["leagueUuid"];
                console.log(this.leagueUuid);
            });

        this.http
            .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.leagueUuid))
            .pipe(map((result) => plainToClass(League, result)))
            .subscribe((result) => {
                this.league = result;
                this.translateService
                    .get('dynamicTitles.newSeason', {leagueName: this.league.leagueName})
                    .subscribe((translation: string) => {
                        this.titleService.setTitle(translation);
                    });
            });
    }

    nextSeasonNumber(): number {
        let numbers = this.league.seasons.map(season => season.seasonNumber);
        return Math.max(...numbers) + 1;
    }

    nextSeasonSoonestDate(): Date {
        let dates = this.league.seasons.map(x => new Date(x.seasonStartDate));
        let date = new Date(Math.max.apply(null, dates));
        date.setDate(date.getDate() + 1);
        return date;
    }

    createNewSeason(): void {
        console.log("Creating new season [%d] for league [%s] on date [%s]",
            this.nextSeasonNumber(),
            this.league.leagueName,
            formatDate(this.newSeasonDate, 'dd.MM.yyyy', 'en-US'));

        let params = new HttpParams()
            .set('seasonNumber', String(this.nextSeasonNumber()))
            .set('startDate', formatDate(this.newSeasonDate, 'yyyy-MM-dd', 'en-US'))
            .set('leagueUuid', this.league.leagueUuid);

        this.http
            .post<Season>(this.apiEndpointsService.getSeasons(), params)
            .pipe(map((result) => plainToClass(Season, result)))
            .subscribe((result) => {

                    let season: Season = result;

                    this.translateService
                        .get('season.new.created')
                        .subscribe((translation: string) => {
                            this.snackBar.open(translation, "X", {
                                duration: 7 * 1000,
                                panelClass: ['mat-toolbar', 'mat-primary']
                            });
                        });

                    console.log(season);

                    this.router.navigate(['season', season.seasonUuid]);
                }
            );

    }

    sanitizeLogo(leagueDto: League): SafeResourceUrl {
        const logo: string = leagueDto.logoSanitized();
        return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
    }

}
