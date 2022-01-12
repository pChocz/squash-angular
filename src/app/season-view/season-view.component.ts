import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SeasonScoreboard} from '../shared/rest-api-dto/season-scoreboard.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {SeasonScoreboardRow} from '../shared/rest-api-dto/season-scoreboard-row.model';
import {Title} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {NGXLogger} from "ngx-logger";
import {Globals} from "../globals";
import {MyLoggerService} from "../shared/my-logger.service";
import {AuthService} from "../shared/auth.service";

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
  dataSource: MatTableDataSource<SeasonScoreboardRow>;
  uuid: string;
  seasonScoreboard: SeasonScoreboard;
  isLoading: boolean;
  noData: boolean;
  leagueLogoBytes: string;
  isModerator: boolean

  constructor(private loggerService: MyLoggerService,
              private route: ActivatedRoute,
              private http: HttpClient,
              private authService: AuthService,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title,
              private translateService: TranslateService) {

    this.selectedType = "FULL";
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.setupComponent(params.uuid);
      this.authService.isModeratorOfLeague(params.uuid).then( (result) => {
            this.isModerator = result;
          }
      );
    });
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

          this.translateService
          .get('dynamicTitles.season',
              {
                seasonNumber: this.seasonScoreboard.season.seasonNumber,
                leagueName: this.seasonScoreboard.season.leagueName
              })
          .subscribe((translation: string) => {
            this.titleService.setTitle(translation);
            this.loggerService.log(translation);
          });

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
          this.loadLogo();
        },
        error => {
          console.log(error);
        },
        () => {
          this.isLoading = false;
        });
  }

  loadLogo(): void {
    this.http
    .get(this.apiEndpointsService.getLeagueLogoBySeasonUuid(this.uuid), {responseType: 'text'})
    .subscribe(
        result => {
          this.leagueLogoBytes = result;
        },
        error => {
          console.log(error);
        });
  }

  toggleScoreboardView(): void {
    if (this.selectedType === 'FULL') {
      this.selectedType = 'MINIFIED';

    } else if (this.selectedType === 'MINIFIED') {
      this.selectedType = 'BALANCE';

    } else /* must be 'BALANCE' */{
      this.selectedType = 'FULL';
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  removeSeason() {

    //todo: implement!!

  }
}
