import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {League} from "../../../shared/rest-api-dto/league.model";

@Component({
    selector: 'app-leagues-table',
    templateUrl: './leagues-table.component.html',
    styleUrls: ['./leagues-table.component.css']
})
export class LeaguesTableComponent implements OnInit {

    @Input() leagues: League[];
    @Input() logosMap: Map<string, string>;

    @ViewChild(MatSort, {static: true}) sort: MatSort;

    dataSource: MatTableDataSource<League>;

    displayedColumns: string[] = [
        'number-column',
        'league-name-column',
        'seasons-column',
        'league-logo-column',
        'uuid-column',
        'edit-button-column',
    ];

    constructor() {
    }

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource(this.leagues);
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
