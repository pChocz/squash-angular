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

    balanceSigned(): string {
        let total = this.plus + this.minus;
        if (total === 0) {
            return '';
        } else {
            const value = this.plus - this.minus;
            return value > 0 ? '(+' + this.utils.numberSeparated(value) + ')' : '(' + this.utils.numberSeparated(value) + ')';
        }
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
