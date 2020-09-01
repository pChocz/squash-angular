import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { LeagueDto } from './model/league-dto.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-all-leagues-view',
  templateUrl: './all-leagues-view.component.html',
  styleUrls: ['./all-leagues-view.component.css']
})
export class AllLeaguesViewComponent implements OnInit {

  leagues: LeagueDto[];

  constructor(
    public sanitizer: DomSanitizer,
    private http: HttpClient,
    private titleService: Title) {

  }

  ngOnInit(): void {
    this.titleService.setTitle("All leagues");
    this.http.get<LeagueDto[]>(environment.apiUrl + 'leagues/general-info')
      .pipe(
        map(result => plainToClass(LeagueDto, result)))
      .subscribe(result => {
        this.leagues = result
      });
  }

  sanitizeLogo(leagueDto: LeagueDto): SafeResourceUrl {
    let logo: string = leagueDto.logoSanitized();
    return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
  }

}
