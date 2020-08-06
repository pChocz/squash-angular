import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { LeagueDto } from './model/league-dto.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-leagues-view',
  templateUrl: './all-leagues-view.component.html',
  styleUrls: ['./all-leagues-view.component.css']
})
export class AllLeaguesViewComponent implements OnInit {

selectedLeagueId: number;

  leagues: LeagueDto[];

  constructor(private route: ActivatedRoute, private router: Router, public sanitizer: DomSanitizer, private http : HttpClient) {

    this.http.get<LeagueDto[]>('http://localhost:8080/leagues/general-info')
    .pipe(
      map(result => plainToClass(LeagueDto, result)))
    .subscribe(result => {
      console.log(result);
      this.leagues = result
    });

    route.params.subscribe(x => {
      this.selectedLeagueId = x.leagueUuid;
      console.log(this.selectedLeagueId);
    });

 }

 sanitizeLogo(leagueDto: LeagueDto) : SafeResourceUrl {
  let logo: string = leagueDto.logoSanitized();
  return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
 }

 onPanelChange(event: any, leagueId : number) {
  this.router.navigateByUrl(`leagues/${leagueId}`);
  console.log(leagueId);
}

  ngOnInit(): void { }

}
