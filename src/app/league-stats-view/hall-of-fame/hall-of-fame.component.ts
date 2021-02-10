import {Component, OnInit, Input} from '@angular/core';
import {HallOfFame} from '../../shared/rest-api-dto/hall-of-fame.model';

@Component({
    selector: 'app-hall-of-fame',
    templateUrl: './hall-of-fame.component.html',
    styleUrls: ['./hall-of-fame.component.css']
})
export class HallOfFameComponent implements OnInit {

    @Input() hallOfFameRows: HallOfFame[];

    displayedColumns: string[] = [
        'season-number-column',
        'league-1st-column',
        'league-2nd-column',
        'league-3rd-column',
        'cup-1st-column',
        'cup-2nd-column',
        'cup-3rd-column',
        'super-cup-column',
        'pretenders-cup-column',
    ];

    constructor() {

    }

    ngOnInit(): void {

    }

}
