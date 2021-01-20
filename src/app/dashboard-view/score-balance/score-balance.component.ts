import {Component, Input, OnInit} from '@angular/core';
import { Utils } from 'src/app/shared/utils';

@Component({
    selector: 'app-score-balance',
    templateUrl: './score-balance.component.html',
    styleUrls: ['./score-balance.component.css']
})
export class ScoreBalanceComponent implements OnInit {

    @Input() plus: number;
    @Input() minus: number;
    utils: Utils;

    constructor() {
        this.utils = new Utils();
    }

    ngOnInit(): void {
    }

    ratio(): string {
        let total = this.plus + this.minus;
        if (total === 0) {
            return '';
        } else {
            let ratio = 100 * this.plus / total
            return ratio.toFixed(2) + '%'
        }
    }

}
