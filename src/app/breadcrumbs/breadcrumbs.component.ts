import {Component, Input, OnInit} from '@angular/core';
import {MatMenu} from "@angular/material/menu";

@Component({
    selector: 'app-breadcrumbs',
    templateUrl: './breadcrumbs.component.html',
    styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

    @Input() public leagueUuid: string;
    @Input() public leagueName: string;
    @Input() public seasonUuid: string;
    @Input() public seasonNumberRoman: string;
    @Input() public date: Date;
    @Input() public menu: MatMenu;

    constructor() {
    }

    ngOnInit(): void {
    }

}
