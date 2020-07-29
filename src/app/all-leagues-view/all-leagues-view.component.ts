import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { LeagueDto } from './model/league-dto.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@Component({
  selector: 'app-all-leagues-view',
  templateUrl: './all-leagues-view.component.html',
  styleUrls: ['./all-leagues-view.component.css']
})
export class AllLeaguesViewComponent implements OnInit {

  leagues: LeagueDto[];
  
  logoSanitizedOne: SafeResourceUrl;
  logoSanitizedTwo: SafeResourceUrl;
  panelOpenState = false;

  constructor(public sanitizer: DomSanitizer, private http : HttpClient) {

    this.http.get<LeagueDto[]>('http://localhost:8080/leagues/general-info')
    .pipe(
      map(result => plainToClass(LeagueDto, result)))
    .subscribe(result => {
      console.log(result);
      this.leagues = result

      // let numberOfGroups: number = this.roundScoreboard.roundGroupScoreboards.length;
      
      // for (let i: number = 0; i < numberOfGroups; i++) {
      //   let roundGroupScoreboard: RoundGroupScoreboard = this.roundScoreboard.roundGroupScoreboards[i];

      //   let groupNumber = i+1;
      //   let numberOfPlayers = roundGroupScoreboard.getNumberOfPlayers();

      //   console.log("group:   " + groupNumber);
      //   console.log("players: " + numberOfPlayers);
      //   console.log(roundGroupScoreboard);
      // }

    });

 }

 sanitizeLogo(leagueDto: LeagueDto) : SafeResourceUrl {
  let logo: string = leagueDto.logoSanitized();
  return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
 }

  ngOnInit(): void { }

}
