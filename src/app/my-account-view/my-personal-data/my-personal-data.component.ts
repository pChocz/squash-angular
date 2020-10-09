import { Component, Input, OnInit } from '@angular/core';
import { PlayerDetailed } from '../../shared/rest-api-dto/player-detailed.model';

@Component({
    selector: 'app-my-personal-data',
    templateUrl: './my-personal-data.component.html',
    styleUrls: ['./my-personal-data.component.css'],
})
export class MyPersonalDataComponent implements OnInit {
    @Input() currentPlayer: PlayerDetailed;

    constructor() {}

    ngOnInit(): void {}
}
