import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Match } from 'src/app/shared/rest-api-dto/match.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-round-group-matches-editable',
    templateUrl: './round-group-matches-editable.component.html',
    styleUrls: ['./round-group-matches-editable.component.css'],
})
export class RoundGroupMatchesEditableComponent implements OnInit {
    @Output('update') change: EventEmitter<Match> = new EventEmitter<Match>();
    @Input() matches: Match[];

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
    ];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {}

    onChange(newValue: number, match: Match, setNumber: number, player: string): void {
        // console.log('attempt to change set [' + setNumber + '] of match: ');
        // console.log(match);
        // console.log('new score for ' + player + ' player: ');
        // console.log(newValue);

        this.http
            .put(
                environment.apiUrl + 'matches/' + match.matchUuid,
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
                    // console.log('Match succesfully changed!');
                    this.change.emit(match);
                },
                (error) => {
                    console.log('Error when changing the match: ', error);
                }
            );
    }
}
