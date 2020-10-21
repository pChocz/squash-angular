import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {League} from "../shared/rest-api-dto/league.model";
import {formatDate} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Season} from "../shared/rest-api-dto/season.model";

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
                private sanitizer: DomSanitizer,
                private snackBar: MatSnackBar,
                private router: Router,
                private titleService: Title) {
        this.newSeasonDate = new Date();
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(
            params => {
                this.leagueUuid = params["leagueUuid"];
                console.log(this.leagueUuid);
            });

        this.http
            .get<League>(environment.apiUrl + 'leagues/general-info/' + this.leagueUuid)
            .pipe(map((result) => plainToClass(League, result)))
            .subscribe((result) => {
                this.league = result;
                console.log(this.league);
                this.titleService.setTitle("New season | " + this.league.leagueName);
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


        //@RequestParam final int seasonNumber,
        //                             @RequestParam @DateTimeFormat(pattern = GeneralUtil.DATE_FORMAT) final LocalDate startDate,
        //                             @RequestParam final UUID leagueUuid) {


        let params = new HttpParams()
            .set('seasonNumber', String(this.nextSeasonNumber()))
            .set('startDate', formatDate(this.newSeasonDate, 'yyyy-MM-dd', 'en-US'))
            .set('leagueUuid', this.league.leagueUuid);

        this.http.post<Season>(environment.apiUrl + 'seasons', params)
            .pipe(map((result) => plainToClass(Season, result)))
            .subscribe((result) => {

                let season: Season = result;

                    this.snackBar.open("New season created", "X", {
                        duration: 7 * 1000,
                        panelClass: ['mat-toolbar', 'mat-primary']
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
