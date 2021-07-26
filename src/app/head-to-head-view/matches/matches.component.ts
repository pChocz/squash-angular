import {Component, Input, OnInit} from '@angular/core';
import {Match} from "../../shared/rest-api-dto/match.model";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  displayedColumns: string[] = [
    'date-column',
    'description-column',
    'go-to-column',
    'first-player',
    'second-player',
    'first-set-first-player',
    'first-set-second-player',
    'second-set-first-player',
    'second-set-second-player',
    'third-set-first-player',
    'third-set-second-player',
    'fourth-set-first-player',
    'fourth-set-second-player',
    'fifth-set-first-player',
    'fifth-set-second-player',
  ];

  @Input() matches: Match[];

  dataSource: MatTableDataSource<Match>;

  constructor() {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Match>(this.matches);
  }

  hasAnySetOfNumber(number: number): boolean {
    for (let match of this.matches) {
      if (match.sets.length >= number) {
        return true;
      }
    }
    return false;
  }

}
