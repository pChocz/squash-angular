import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-score-balance',
    templateUrl: './score-balance.component.html',
    styleUrls: ['./score-balance.component.css']
})
export class ScoreBalanceComponent implements OnInit {

    @Input() plus: number;
    @Input() minus: number;

    constructor() {
    }

    ngOnInit(): void {
    }

    balanceSigned(): string {
        let total = this.plus + this.minus;
        if (total === 0) {
            return '';
        } else {
            const value = this.plus - this.minus;
            return value > 0 ? '(+' + this.numberSeparated(value) + ')' : '(' + this.numberSeparated(value) + ')';
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

    numberSeparated(number: number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

}
