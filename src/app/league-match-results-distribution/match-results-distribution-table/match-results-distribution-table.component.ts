import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LeagueMatchResultDistribution} from "../../shared/rest-api-dto/league-match-result-distribution.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {PlayerMatchResultDistribution} from "../../shared/rest-api-dto/player-match-result-distribution.model";
import {Player} from "../../shared/rest-api-dto/player.model";

@Component({
  selector: 'app-match-results-distribution-table',
  templateUrl: './match-results-distribution-table.component.html',
  styleUrls: ['./match-results-distribution-table.component.css']
})
export class MatchResultsDistributionTableComponent implements OnInit {

  @Input() matchResultDistribution: LeagueMatchResultDistribution;
  leagueUuid: string;
  selectionMap: Map<number, boolean>;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: MatTableDataSource<PlayerMatchResultDistribution>;
  displayedColumns: string[];

  constructor(private apiEndpointsService: ApiEndpointsService,
              private http: HttpClient) { }

  ngOnInit(): void {
    this.leagueUuid = this.matchResultDistribution.league.leagueUuid;
    this.selectionMap = new Map();
    this.updateTable();
  }

  onChange(seasonNumber: number, $event: any) {
    this.selectionMap.set(seasonNumber, $event);

    let selectedSeasonNumbers: number[] = [];
    for (const [key, value] of this.selectionMap) {
      if (value) {
        selectedSeasonNumbers.push(key);
      }
    }

    this.http
        .get<LeagueMatchResultDistribution>(this.apiEndpointsService.getLeagueMatchResultsDistribution(this.leagueUuid, selectedSeasonNumbers))
        .pipe(map((result) => plainToInstance(LeagueMatchResultDistribution, result)))
        .subscribe((result) => {
          this.matchResultDistribution = result;
          this.updateTable();
        });
  }

  updateTable(): void {
    this.displayedColumns = [];
    this.displayedColumns.push('player');
    this.displayedColumns.push(...this.extractPlayers())
    this.displayedColumns.push('total')

    this.dataSource = new MatTableDataSource(this.matchResultDistribution.playerMatchResultDistributionList);
  }

  private extractPlayers(): string[] {
    return this.matchResultDistribution
        .playerMatchResultDistributionList
        .map(v => v.player.username);
  }

  findPlayerByUsername(username: string): Player {
    return this.matchResultDistribution
        .playerMatchResultDistributionList
        .filter(v => v.player.username === username)
        .pop()
        .player;
  }

  countAllMatchesWon(): number {
    return this.matchResultDistribution
        .playerMatchResultDistributionList
        .map(v => v.opponentMatchResultDistributionList)
        .reduce((acc, curr) => {
          return acc + curr.reduce((a, b) => a + b.matchesWon, 0)
        }, 0);
  }

  countLostMatchesForPlayer(username: string) {
    let matchesLost = 0;
    for (let v of this.matchResultDistribution.playerMatchResultDistributionList) {
      for (let vv of v.opponentMatchResultDistributionList) {
        if (vv.opponent.username === username) {
          matchesLost += vv.matchesWon;
        }
      }
    }
    return matchesLost;
  }

  countWonMatchesForPlayer(username: string) {
    for (let v of this.matchResultDistribution.playerMatchResultDistributionList) {
        if (v.player.username === username) {
          return v.matchesWon
        }
      }
    return null;
    }
}
