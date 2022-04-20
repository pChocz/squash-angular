import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-trophy-icon',
    templateUrl: './trophy-icon.component.html',
    styleUrls: ['./trophy-icon.component.css']
})
export class TrophyIconComponent implements OnInit {

    @Input() trophy: string;

    constructor() {
    }

    ngOnInit(): void {
    }

}
