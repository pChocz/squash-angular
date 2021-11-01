import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Player} from '../shared/rest-api-dto/player.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {Title} from '@angular/platform-browser';
import {League} from '../shared/rest-api-dto/league.model';
import {Subject} from 'rxjs';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MyLoggerService} from "../shared/my-logger.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-league-players',
  templateUrl: './league-players.component.html',
  styleUrls: ['./league-players.component.css'],
})
export class LeaguePlayersComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  leagueUuid: string;
  league: League;
  players: Player[];
  isLoading: boolean;
  selectedPlayersUuids: string[];

  constructor(private loggerService: MyLoggerService,
              private translateService: TranslateService,
              private route: ActivatedRoute,
              private apiEndpointsService: ApiEndpointsService,
              private http: HttpClient,
              private titleService: Title) {

  }

  ngOnInit(): void {
    this.route
    .params
    .subscribe((params) => (this.leagueUuid = params.uuid));

    this.http
    .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.leagueUuid))
    .pipe(map((result) => plainToClass(League, result)))
    .subscribe((result) => {
      this.league = result;

      this.translateService
      .get('player.plural')
      .subscribe((translation: string) => {
        this.titleService.setTitle(translation + " | " + this.league.leagueName);
        this.loggerService.log(translation + " | " + this.league.leagueName);
      });
    });

    this.http
    .get<Player[]>(this.apiEndpointsService.getLeaguePlayersByUuid(this.leagueUuid))
    .pipe(map((result) => plainToClass(Player, result)))
    .subscribe((result) => {
      this.players = result;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
