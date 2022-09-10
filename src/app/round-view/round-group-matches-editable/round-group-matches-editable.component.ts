import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Match} from 'src/app/shared/rest-api-dto/match.model';
import {HttpClient} from '@angular/common/http';
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {NotificationService} from "../../shared/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {EditMatchFootageDialogComponent} from "../../shared/modals/edit-match-footage-dialog.component";

@Component({
    selector: 'app-round-group-matches-editable',
    templateUrl: './round-group-matches-editable.component.html',
    styleUrls: ['./round-group-matches-editable.component.css'],
})
export class RoundGroupMatchesEditableComponent implements OnInit {

    @Output('update') change: EventEmitter<Match> = new EventEmitter<Match>();
    @Input() matches: Match[];
    @Input() isOwner: boolean;
    @Input() isModerator: boolean;

    headers: string[] = [
        'header-row-players',
        'header-row-empty',
        'header-row-first-set',
        'header-row-second-set',
        'header-row-third-set',
        'header-row-fourth-set',
        'header-row-fifth-set'
    ];

    displayedColumns: string[] = [
        'first-player',
        'first-player-emoji',
        'second-player-emoji',
        'second-player',
        'match-referee',
        'add-footage',
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
                private dialog: MatDialog,
                private notificationService: NotificationService,
                private apiEndpointsService: ApiEndpointsService) {

    }

    ngOnInit(): void {
    }

    onChange(newValue: number, match: Match, setNumber: number, player: string): void {

        this.http
            .put<Match>(this.apiEndpointsService.getMatchByUuid(match.matchUuid),
                {},
                {
                    params: {
                        setNumber: setNumber.toString(),
                        player,
                        newScore: newValue.toString(),
                    },
                }
            )
            .pipe(map((result) => plainToInstance(Match, result)))
            .subscribe({
                next: (editedMatch) => {
                    this.change.emit(match);
                    this.notificationService.success(editedMatch.getResult());
                },
                error: () => {
                    this.change.emit(match);
                }
            });
    }

    openMatchFootageLinkEditModal(match: Match) {
        const dialogRef = this.dialog.open(EditMatchFootageDialogComponent, {
            data: {match: match},
            autoFocus: false
        });

        dialogRef.afterClosed()
            .subscribe({
                next: (result) => {
                    if (result === true) {
                        this.change.emit(match);
                    }
                }
            });
    }
}
