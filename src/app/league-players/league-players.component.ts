import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Player } from '../shared/player.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { PlayersScoreboard } from './model/players-scoreboard.model';
import { Title, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LeagueDto } from '../all-leagues-view/model/league-dto.model';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-league-players',
  templateUrl: './league-players.component.html',
  styleUrls: ['./league-players.component.css'],
})
export class LeaguePlayersComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  uuid: string;
  league: LeagueDto;

  selectionMap: Map<Player, boolean>;
  players: Player[];
  selectedPlayers: Player[] = [];
  playersScoreboard: PlayersScoreboard;

  allChecked: boolean;
  noMatchesPlayed: boolean;

  isLoading: boolean;

  constructor(
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private http: HttpClient,
    private titleService: Title
  ) {
    this.selectionMap = new Map();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => (this.uuid = params['uuid']));

    this.http
      .get<LeagueDto>(environment.apiUrl + 'leagues/general-info/' + this.uuid)
      .pipe(map((result) => plainToClass(LeagueDto, result)))
      .subscribe((result) => {
        this.league = result;
        this.titleService.setTitle('Players | ' + this.league.leagueName);
      });

    this.http
      .get<Player[]>(
        environment.apiUrl + 'leagues/' + this.uuid + '/players-general'
      )
      .pipe(map((result) => plainToClass(Player, result)))
      .subscribe((result) => {
        this.players = result;
        this.players.forEach((player) => this.selectionMap.set(player, false));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  sanitizeLogo(leagueDto: LeagueDto): SafeResourceUrl {
    let logo: string = leagueDto.logoSanitized();
    return this.sanitizer.bypassSecurityTrustResourceUrl(logo);
  }

  onChange(player: Player, selected: boolean): void {
    this.selectionMap.set(player, selected);
    this.updateComponent();
  }

  selectAll(): void {
    for (let [key, value] of this.selectionMap) {
      this.selectionMap.set(key, true);
    }
    this.updateComponent();
  }

  deselectAll(): void {
    for (let [key, value] of this.selectionMap) {
      this.selectionMap.set(key, false);
    }
    this.updateComponent();
  }

  updateComponent(): void {
    this.isLoading = true;
    this.playersScoreboard = null;
    this.noMatchesPlayed = false;
    this.selectedPlayers = [];
    
    for (let [key, value] of this.selectionMap) {
      if (value) {
        this.selectedPlayers.push(key);
      }
    }

    if (this.selectedPlayers.length > 0) {
      let commaSeparatedPlayersIds: string = Array.prototype.map.call(
        this.selectedPlayers,
        (player: Player) => player.id
      );

      let link: string = environment.apiUrl + 'scoreboards/leagues/' + this.uuid + '/players/' + commaSeparatedPlayersIds;

      this.http
        .get<PlayersScoreboard>(link)
        .pipe(
          map(result => plainToClass(PlayersScoreboard, result)))
        .subscribe((result) => {
          this.playersScoreboard = result;
          if (this.playersScoreboard.numberOfMatches === 0) {
            this.noMatchesPlayed = true;
            this.playersScoreboard = null;
          }
          this.isLoading = false;
        });
    } else {
      this.isLoading = false;
    }
  }

}
