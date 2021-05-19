import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-count-up-tile-six',
    templateUrl: './count-up-tile-six.component.html',
    styleUrls: ['./count-up-tile-six.component.css']
})
export class CountUpTileSixComponent implements OnInit {

    @Input() title: string;
    @Input() subtitle1: string;
    @Input() subtitle2: string;
    @Input() subtitle3: string;
    @Input() subtitle4: string;
    @Input() subtitle5: string;
    @Input() subtitle6: string;
    @Input() value1: number;
    @Input() value2: number;
    @Input() value3: number;
    @Input() value4: number;
    @Input() value5: number;
    @Input() value6: number;
    @Input() decimalPlaces: number;

    constructor() {
    }

    ngOnInit(): void {
    }

}
