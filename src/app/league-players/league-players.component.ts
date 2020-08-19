import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Player } from '../shared/player.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Match } from '../shared/match.model';
import { PlayersScoreboard } from './model/players-scoreboard.model';
import { Title, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LeagueDto } from '../all-leagues-view/model/league-dto.model';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormBuilder } from '@angular/forms';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { callbackify } from 'util';
import { error } from 'protractor';

@Component({
  selector: 'app-league-players',
  templateUrl: './league-players.component.html',
  styleUrls: ['./league-players.component.css']
})
export class LeaguePlayersComponent implements OnInit {

  title = 'Kto jest największym gejem?';
  type = 'BarChart';
  data = [
    ['Dziad', 0.5],
    ['Maniak', 0.2],
    ['Śruba', 0.25],
    ['Siwy', 1]
  ];
  columnNames = ['Browser', 'Value'];
  options = {
    legend: 'none',
    width: 800,
    height: 300,
    animation: {
      duration: 500,
      startup: true
    },
    backgroundColor: 'transparent',
    is3D: true
  };













  selectionMap: Map<Player, boolean>;

  allChecked: boolean;

  uid: number;
  players: Player[];
  selectedPlayers: Player[] = [];
  link: string;
  playersScoreboard: PlayersScoreboard;

  noMatchesPlayed: boolean;

  isLoading: boolean;

  league: LeagueDto;

  constructor(private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private http: HttpClient,
    private titleService: Title) {



    this.selectionMap = new Map();
    this.isLoading = true;


    this.route.params.subscribe(params => this.uid = params["uid"]);
    console.log(this.uid);

    this.http.get<LeagueDto>('http://localhost:8080/leagues/general-info/' + this.uid)
      .pipe(
        map(result => plainToClass(LeagueDto, result)))
      .subscribe(result => {
        console.log(result);
        this.league = result;
        this.titleService.setTitle("Players | " + this.league.leagueName);
      });

    this.http.get<Player[]>('http://localhost:8080/leagues/' + this.uid + '/players-general')
      .pipe(
        map(result => plainToClass(Player, result)))
      .subscribe(result => {



        console.log(result);
        this.players = result;

        this.players.forEach(player => this.selectionMap.set(player, false));
        console.log(this.selectionMap);

        this.isLoading = false;

      });


  }

  ngOnInit(): void {
  }

  sanitizeLogo(leagueDto: LeagueDto): SafeResourceUrl {
    let logo: string = leagueDto.logoSanitized();
    return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
  }

  onChange(player: Player, selected: boolean): void {
    this.selectionMap.set(player, selected);
    this.callBackend();
  }

  selectAll(): void {
    for (let [key, value] of this.selectionMap) {
      this.selectionMap.set(key, true)
    }
    this.callBackend();
  }

  deselectAll(): void {
    for (let [key, value] of this.selectionMap) {
      this.selectionMap.set(key, false)
    }
    this.callBackend();
  }

  callBackend(): void {
    this.noMatchesPlayed = false;
    this.isLoading = true;
    this.selectedPlayers = [];
    for (let [key, value] of this.selectionMap) {
      if (value) {
        this.selectedPlayers.push(key)
      }
    }

    this.playersScoreboard = null;

    if (this.selectedPlayers.length > 0) {
      let commaSeparatedPlayersIds: string = Array.prototype.map.call(this.selectedPlayers, (player: Player) => player.id);
      this.link = "http://localhost:8080/scoreboards/leagues/" + this.uid + "/players/" + commaSeparatedPlayersIds;
      console.log(this.link);

      this.http.get<PlayersScoreboard>(this.link)
        .pipe(
          map(result => plainToClass(PlayersScoreboard, result)))
        .subscribe(
          result => {
            console.log(result);
            this.playersScoreboard = result;
            this.isLoading = false;


            this.data = [];
            this.playersScoreboard.scoreboardRows.forEach(row => {
              this.data.push([row.player.username, row.matchesBalance]);
            });



          },
          error => {
            console.log(error);
            this.isLoading = false;
            this.noMatchesPlayed = true;
          }
        );

    } else {
      this.isLoading = false;
    }
  }

}
