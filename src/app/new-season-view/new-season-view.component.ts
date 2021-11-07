import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {League} from "../shared/rest-api-dto/league.model";
import {formatDate} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Season} from "../shared/rest-api-dto/season.model";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {FormControl, Validators} from "@angular/forms";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-new-season-view',
  templateUrl: './new-season-view.component.html',
  styleUrls: ['./new-season-view.component.css']
})
export class NewSeasonViewComponent implements OnInit {

  descriptionField = new FormControl('',
      [Validators.maxLength(100)]
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
        this.loggerService.log(translation);
      });
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
    console.log("Creating new season [%d] for league [%s] on date [%s]",
        this.nextSeasonNumber(),
        this.league.leagueName,
        formatDate(this.newSeasonDate, 'dd.MM.yyyy', 'en-US'));

    let params = new HttpParams()
    .set('seasonNumber', String(this.nextSeasonNumber()))
    .set('startDate', formatDate(this.newSeasonDate, 'yyyy-MM-dd', 'en-US'))
    .set('leagueUuid', this.league.leagueUuid)
    .set('xpPointsType', this.selectedXpPointsType);

    if (this.descriptionField.value) {
      params = params.append('description', this.descriptionField.value);
    }

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

          this.router.navigate(['season', season.seasonUuid]);
        }
    );

  }

}
