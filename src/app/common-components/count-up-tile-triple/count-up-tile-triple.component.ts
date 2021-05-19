import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-count-up-tile-triple',
    templateUrl: './count-up-tile-triple.component.html',
    styleUrls: ['./count-up-tile-triple.component.css']
})
export class CountUpTileTripleComponent implements OnInit {

    @Input() title: string;
    @Input() subtitle1: string;
    @Input() subtitle2: string;
    @Input() subtitle3: string;
    @Input() value1: number;
    @Input() value2: number;
    @Input() value3: number;
    @Input() decimalPlaces: number;

    constructor() {
    }

    ngOnInit(): void {
    }

}
