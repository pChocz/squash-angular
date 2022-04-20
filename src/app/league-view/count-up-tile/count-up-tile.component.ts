import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-count-up-tile',
    templateUrl: './count-up-tile.component.html',
    styleUrls: ['./count-up-tile.component.css']
})
export class CountUpTileComponent implements OnInit {

    @Input() title: string;
    @Input() value: number;
    @Input() decimalPlaces: number;

    constructor() {
    }

    ngOnInit(): void {
    }

}
