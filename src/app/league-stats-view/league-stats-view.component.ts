import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Title, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { LeagueStatsDto } from './model/league-stats-dto.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-league-stats-view',
  templateUrl: './league-stats-view.component.html',
  styleUrls: ['./league-stats-view.component.css']
})
export class LeagueStatsViewComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  uuid: string;
  leagueStats: LeagueStatsDto;

  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private http: HttpClient,
    private titleService: Title) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.uuid = params["uuid"]);
    this.http.get<LeagueStatsDto>(environment.apiUrl + 'leagues/' + this.uuid + '/stats')
      .pipe(
        map(result => plainToClass(LeagueStatsDto, result)))
      .subscribe(result => {
        this.leagueStats = result;
        this.titleService.setTitle("League stats | " + this.leagueStats.leagueName);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  sanitizeLogo(leagueDto: LeagueStatsDto): SafeResourceUrl {
    let logo: string = leagueDto.logoSanitized();
    return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
  }

}
