import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {League} from "../shared/rest-api-dto/league.model";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";

@Component({
  selector: 'app-admin-panel-view',
  templateUrl: './admin-panel-view.component.html',
  styleUrls: ['./admin-panel-view.component.css']
})
export class AdminPanelViewComponent implements OnInit {

  tab: string;
  availableTabs = ['app-stats', 'players', 'users', 'leagues', 'league-roles', 'backup'];
  selectedTabIndex = 0;

  leagues: League[];
  logosMap: Map<string, string>;
  players: PlayerDetailed[];

  constructor(private apiEndpointsService: ApiEndpointsService,
              private http: HttpClient,
              private titleService: Title,
              private route: ActivatedRoute,
              private router: Router,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.route
    .params
    .subscribe(params => {
      this.tab = params['tab'];
      this.switchTab(this.availableTabs.indexOf(this.tab));
    });

    this.translateService
    .get('adminPanel.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
    });

    this.http
    .get<PlayerDetailed[]>(this.apiEndpointsService.getAllPlayers())
    .pipe(map((result) => plainToClass(PlayerDetailed, result)))
    .subscribe((result) => {
      this.players = result;
      console.log(this.players);
    });

    this.http
    .get<League[]>(this.apiEndpointsService.getAllLeaguesGeneralInfo())
    .pipe(map((result) => plainToClass(League, result)))
    .subscribe((result) => {
      this.leagues = result;
    });

    this.http
    .get(this.apiEndpointsService.getAllLeaguesLogos())
    .subscribe((result) => {
      this.logosMap = new Map<string, string>();
      for (let item in result) {
        this.logosMap.set(item, result[item]);
      }
    });
  }

  switchTab(index: number): void {
    if (index === -1) {
      index = 0;
    }
    this.selectedTabIndex = index;
    this.router.navigate(['/admin-panel', this.availableTabs[index]]);
  }

}
