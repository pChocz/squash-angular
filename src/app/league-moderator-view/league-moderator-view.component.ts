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
import {plainToClass} from "class-transformer";

@Component({
  selector: 'app-league-moderator-view',
  templateUrl: './league-moderator-view.component.html',
  styleUrls: ['./league-moderator-view.component.css']
})
export class LeagueModeratorViewComponent implements OnInit {

  uuid: string;
  league: League;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.uuid = params.uuid;
    });


    this.http
    .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.uuid))
    .pipe(map((result) => plainToClass(League, result)))
    .subscribe((result) => {
      this.league = result;

      this.translateService
      .get('dynamicTitles.moderatingLeague',
          {leagueName: this.league.leagueName}
      )
      .subscribe((res: string) => {
        this.titleService.setTitle(res);
      });
    });

  }

}
