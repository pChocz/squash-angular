import {Component, Input, OnInit} from '@angular/core';
import {MatRadioChange} from '@angular/material/radio';
import {PlayersScoreboard} from 'src/app/shared/rest-api-dto/players-scoreboard.model';
import {HttpClient} from '@angular/common/http';
import {plainToInstance} from 'class-transformer';
import {map} from 'rxjs/operators';
import {PlayerDetailed} from "../../shared/rest-api-dto/player-detailed.model";
import {League} from "../../shared/rest-api-dto/league.model";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";

@Component({
  selector: 'app-my-matches-stats',
  templateUrl: './my-matches-stats.component.html',
  styleUrls: ['./my-matches-stats.component.css'],
})
export class MyMatchesStatsComponent implements OnInit {
  @Input() currentPlayer: PlayerDetailed;

  selectedLeague: League;
  playersScoreboard: PlayersScoreboard;
  isLoading: boolean;
  noStats: boolean;
  availableLeagues: League[];

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService) {

  }

  ngOnInit(): void {
    this.availableLeagues = this
    .currentPlayer
    .leagueRoles
    .map(role => new League(role.leagueName, role.leagueUuid))
    .filter((v, i, a) => a.findIndex(t => (t.leagueUuid === v.leagueUuid)) === i)
    .sort((a, b) => a.leagueUuid.localeCompare(b.leagueUuid));

    if (this.availableLeagues.length > 0) {
      this.selectedLeague = this.availableLeagues[0];
      this.updateComponent();
    }
  }

  changeLeague(event: MatRadioChange): void {
    this.selectedLeague = event.value;
    this.updateComponent();
  }

  updateComponent(): void {
    this.isLoading = true;
    const leagueUuid = this.selectedLeague.leagueUuid;

    this.http
    .get<PlayersScoreboard>(this.apiEndpointsService.getMeAgainstAllScoreboardForLeagueByUuid(leagueUuid))
    .pipe(map((result) => plainToInstance(PlayersScoreboard, result)))
    .subscribe((result) => {
      this.playersScoreboard = result;
      if (this.playersScoreboard.scoreboardRows.length === 0) {
        this.playersScoreboard = null;
        this.noStats = true;
      } else {
        this.noStats = false;
      }
      this.isLoading = false;
    });
  }

}
