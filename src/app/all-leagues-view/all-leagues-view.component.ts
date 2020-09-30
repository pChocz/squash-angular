import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer, Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { LeagueDto } from './model/league-dto.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { environment } from 'src/environments/environment';
import { formatDate, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-all-leagues-view',
  templateUrl: './all-leagues-view.component.html',
  styleUrls: ['./all-leagues-view.component.css']
})
export class AllLeaguesViewComponent implements OnInit, AfterViewInit {

  leagues: LeagueDto[];
  selectedLeagueUuid: string;

  constructor(
    public sanitizer: DomSanitizer,
    private http: HttpClient,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedLeagueUuid = params.expand;
    });

    this.titleService.setTitle('All leagues');
    this.http.get<LeagueDto[]>(environment.apiUrl + 'leagues/general-info')
      .pipe(
        map(result => plainToClass(LeagueDto, result)))
      .subscribe(result => {
        this.leagues = result;
      });
  }

  ngAfterViewInit(): void {
    if (this.selectedLeagueUuid) {
      setTimeout(() => {
        this.scroll(this.selectedLeagueUuid);
      }, 250);
    }
  }

  sanitizeLogo(leagueDto: LeagueDto): SafeResourceUrl {
    const logo: string = leagueDto.logoSanitized();
    console.log(logo);
    return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
  }

  dateFormatted(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', 'en-US');
  }

  public myMethodChangingQueryParams(open: boolean, uuid: string) {

    let queryParams: Params;

    if (open) {
      this.selectedLeagueUuid = uuid;
      queryParams = { expand: this.selectedLeagueUuid };

    } else {
      this.selectedLeagueUuid = null;
      queryParams = {};

    }

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams,
      });
  }

  scroll(id: string) {
    const elmnt = document.getElementById(id);
    elmnt.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest' });
  }

}
