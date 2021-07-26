import {Component, Input, OnInit} from '@angular/core';
import {League} from "../../shared/rest-api-dto/league.model";
import {Player} from "../../shared/rest-api-dto/player.model";
import {PlayersScoreboard} from "../../shared/rest-api-dto/players-scoreboard.model";
import {MatchesPaginated} from "../../shared/rest-api-dto/matches-paginated.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";

@Component({
  selector: 'app-individual-group-stats',
  templateUrl: './individual-group-stats.component.html',
  styleUrls: ['./individual-group-stats.component.css']
})
export class IndividualGroupStatsComponent implements OnInit {

  @Input() league: League;
  @Input() players: Player[];

  selectionMap: Map<Player, boolean>;
  selectedSeasonUuid: string;
  selectedGroupNumber: number;
  selectedAdditionalMatches: boolean;

  selectedPlayersUuids: string[];
  selectedPlayers: Player[] = [];
  playersScoreboard: PlayersScoreboard;

  matchesSimplePaginated: MatchesPaginated;

  allChecked: boolean;
  noMatchesPlayed: boolean;

  isLoading: boolean;

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService) {
    this.selectionMap = new Map();
    this.selectedSeasonUuid = '';
    this.selectedGroupNumber = 0;
    this.selectedAdditionalMatches = false;
  }

  ngOnInit(): void {
    this.players.forEach((player) => this.selectionMap.set(player, false));
  }


  onChange(player: Player, selected: boolean): void {
    this.selectionMap.set(player, selected);
    this.updateComponent();
  }

  onSeasonSelectChange(newValue: string): void {
    this.selectedSeasonUuid = newValue;
    this.updateComponent();
  }

  onGroupSelectChange(newValue: number): void {
    this.selectedGroupNumber = newValue;
    this.updateComponent();
  }

  onAdditionalMatchesSelectChange(newValue: boolean): void {
    if (this.selectedAdditionalMatches !== newValue) {
      this.selectedAdditionalMatches = !this.selectedAdditionalMatches;
    }
    this.updateComponent();
  }

  selectAll(): void {
    for (const [key, value] of this.selectionMap) {
      this.selectionMap.set(key, true);
    }
    this.updateComponent();
  }

  deselectAll(): void {
    for (const [key, value] of this.selectionMap) {
      this.selectionMap.set(key, false);
    }
    this.updateComponent();
  }

  updateComponent(): void {
    this.isLoading = true;
    this.playersScoreboard = null;
    this.noMatchesPlayed = false;
    this.selectedPlayers = [];

    for (const [key, value] of this.selectionMap) {
      if (value) {
        this.selectedPlayers.push(key);
      }
    }

    if (this.selectedPlayers.length > 0) {
      this.selectedPlayersUuids = this.selectedPlayers.map(player => player.uuid);

      let httpParams = new HttpParams();
      if (this.selectedSeasonUuid !== '0') {
        httpParams = httpParams.append('seasonUuid', this.selectedSeasonUuid);
      }
      if (this.selectedGroupNumber > 0) {
        httpParams = httpParams.append('groupNumber', String(this.selectedGroupNumber));
      }
      httpParams = httpParams.append('includeAdditionalMatches', String(this.selectedAdditionalMatches));

      this.http
      .get<PlayersScoreboard>(this.apiEndpointsService.getSelectedPlayersScoreboardForLeague(this.league.leagueUuid, this.selectedPlayersUuids), {params: httpParams})
      .pipe(map((result) => plainToClass(PlayersScoreboard, result)))
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
