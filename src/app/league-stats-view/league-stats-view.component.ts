import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Title, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { LeagueStats } from '../shared/rest-api-dto/league-stats.model';
import { Subject } from 'rxjs';
import {ApiEndpointsService} from "../shared/api-endpoints.service";

@Component({
  selector: 'app-league-stats-view',
  templateUrl: './league-stats-view.component.html',
  styleUrls: ['./league-stats-view.component.css']
})
export class LeagueStatsViewComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  uuid: string;
  leagueStats: LeagueStats;

  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private http: HttpClient,
    private apiEndpointsService: ApiEndpointsService,
    private titleService: Title) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.uuid = params["uuid"]);
    this.http.get<LeagueStats>(this.apiEndpointsService.getLeagueStatsByUuid(this.uuid))
      .pipe(
        map(result => plainToClass(LeagueStats, result)))
      .subscribe(result => {
        this.leagueStats = result;
        this.titleService.setTitle("League stats | " + this.leagueStats.leagueName);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  sanitizeLogo(leagueDto: LeagueStats): SafeResourceUrl {
    let logo: string = leagueDto.logoSanitized();
    return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
  }

}
