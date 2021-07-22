import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Match} from 'src/app/shared/rest-api-dto/match.model';
import {HttpClient} from '@angular/common/http';
import {ApiEndpointsService} from "../../shared/api-endpoints.service";

@Component({
    selector: 'app-round-group-matches-editable',
    templateUrl: './round-group-matches-editable.component.html',
    styleUrls: ['./round-group-matches-editable.component.css'],
})
export class RoundGroupMatchesEditableComponent implements OnInit {

    @Output('update') change: EventEmitter<Match> = new EventEmitter<Match>();
    @Input() matches: Match[];

    headers: string[] = [
        'header-row-players',
        'header-row-status',
        'header-row-first-set',
        'header-row-second-set',
        'header-row-third-set',
        'header-row-fourth-set',
        'header-row-fifth-set'
    ];

    displayedColumns: string[] = [
        'first-player',
        'second-player',
        'match-status',
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

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService) {

    }

    ngOnInit(): void {
    }

    onChange(newValue: number, match: Match, setNumber: number, player: string): void {

        this.http
            .put(this.apiEndpointsService.getMatchByUuid(match.matchUuid),
                {},
                {
                    params: {
                        setNumber: setNumber.toString(),
                        player,
                        newScore: newValue.toString(),
                    },
                }
            )
            .subscribe(
                () => {
                    this.change.emit(match);
                },
                (error) => {
                    console.log('Error when changing the match: ', error);
                }
            );
    }
}
