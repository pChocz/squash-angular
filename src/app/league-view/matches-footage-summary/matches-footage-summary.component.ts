import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {Match} from "../../shared/rest-api-dto/match.model";

@Component({
  selector: 'app-matches-footage-summary',
  templateUrl: './matches-footage-summary.component.html',
  styleUrls: ['./matches-footage-summary.component.css']
})
export class MatchesFootageSummaryComponent implements OnInit {

  @Input() leagueUuid: string;
  matches: Match[];

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService) {

  }

  ngOnInit(): void {
    this.http
        .get<Match[]>(this.apiEndpointsService.getMatchesWithFootageForLeague(this.leagueUuid))
        .pipe(map(result => plainToInstance(Match, result)))
        .subscribe((result) => {
          this.matches = result;
        });
  }

}
