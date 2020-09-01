import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, Title, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { LeagueDto } from '../all-leagues-view/model/league-dto.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-league-stats-view',
  templateUrl: './league-stats-view.component.html',
  styleUrls: ['./league-stats-view.component.css']
})
export class LeagueStatsViewComponent implements OnInit {

  uuid: string;
  // to be replaced later with proper league stats DTO
  league: LeagueDto;

  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private http: HttpClient,
    private titleService: Title) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.uuid = params["uuid"]);
    this.http.get<LeagueDto>(environment.apiUrl + 'leagues/general-info/' + this.uuid)
      .pipe(
        map(result => plainToClass(LeagueDto, result)))
      .subscribe(result => {
        this.league = result;
        this.titleService.setTitle("League stats | " + this.league.leagueName);
      });
  }

  sanitizeLogo(leagueDto: LeagueDto): SafeResourceUrl {
    let logo: string = leagueDto.logoSanitized();
    return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
  }

}
