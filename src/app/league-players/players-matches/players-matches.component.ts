import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Match } from 'src/app/shared/match.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-players-matches',
  templateUrl: './players-matches.component.html',
  styleUrls: ['./players-matches.component.css']
})
export class PlayersMatchesComponent implements OnInit {
  
  displayedColumns: string[] = [
    'date-column',
    'first-player',
    'second-player',
    'first-set-first-player',
    'first-set-second-player',
    'second-set-first-player',
    'second-set-second-player',
    'third-set-first-player',
    'third-set-second-player',
  ];
  
  @Input() matches : Match[];
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  dataSource: MatTableDataSource<Match>;

  constructor() { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Match>(this.matches)
    this.dataSource.paginator = this.paginator;
  }

  dateFormatted(date: Date): string {
    return formatDate(date, 'dd.MM.yyyy', 'en-US');
  }

}
