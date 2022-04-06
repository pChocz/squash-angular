import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {TranslateService} from "@ngx-translate/core";
import {League} from "../shared/rest-api-dto/league.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {MyLoggerService} from "../shared/my-logger.service";
import {PlayerForLeagueModerator} from "../shared/rest-api-dto/player-for-league-moderator.model";

@Component({
  selector: 'app-league-moderator-view',
  templateUrl: './league-moderator-view.component.html',
  styleUrls: ['./league-moderator-view.component.css']
})
export class LeagueModeratorViewComponent implements OnInit {

  uuid: string;
  league: League;
  players: PlayerForLeagueModerator[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              private loggerService: MyLoggerService,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private translateService: TranslateService) {

  }

  setupComponent(leagueUuid: string) {
    this.uuid = leagueUuid;

    this.http
    .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.uuid))
    .pipe(map((result) => plainToInstance(League, result)))
    .subscribe((result) => {
      this.league = result;

      this.translateService
      .get('dynamicTitles.moderatingLeague',
          {leagueName: this.league.leagueName}
      )
      .subscribe((res: string) => {
        this.titleService.setTitle(res);
        this.loggerService.log(res);
      });
    });

    this.http
    .get<PlayerForLeagueModerator[]>(this.apiEndpointsService.getLeaguePlayersForLeagueModeratorByUuid(this.uuid))
    .pipe(map((result) => plainToInstance(PlayerForLeagueModerator, result)))
    .subscribe((result) => {
      result.sort((a, b) => a.username.localeCompare(b.username));
      this.players = result;
    });

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.uuid !== this.uuid) {
        this.setupComponent(params.uuid);
      }
    });
  }

  leaguePlayers(): PlayerForLeagueModerator[] {
    return this.players.filter(player => player.isPlayer());
  }

  leagueModerators(): PlayerForLeagueModerator[] {
    return this.players.filter(player => player.isModerator());
  }
}
