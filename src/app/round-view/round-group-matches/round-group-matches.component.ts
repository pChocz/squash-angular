import {Component, Input, OnInit} from '@angular/core';
import {Match} from 'src/app/shared/rest-api-dto/match.model';

@Component({
    selector: 'app-round-group-matches',
    templateUrl: './round-group-matches.component.html',
    styleUrls: ['./round-group-matches.component.css'],
})
export class RoundGroupMatchesComponent implements OnInit {

    @Input() matches: Match[];

    headers: string[] = [
        'header-row-players',
        'header-row-first-set',
        'header-row-second-set',
        'header-row-third-set',
        'header-row-fourth-set',
        'header-row-fifth-set',
    ];

    displayedColumns: string[] = [
        'first-player',
        'first-player-emoji',
        'second-player-emoji',
        'second-player',
        'head-to-head',
        'first-set-first-player',
        'first-set-second-player',
        'second-set-first-player',
        'second-set-second-player',
        'third-set-first-player',
        'third-set-second-player',
        'fourth-set-first-player',
        'fourth-set-second-player',
        'fifth-set-first-player',
        'fifth-set-second-player',
    ];

    constructor() {
    }

    ngOnInit(): void {
    }

    isLink(footageLink: string): boolean {
        return footageLink
            && footageLink.startsWith("https://");
    }
}
