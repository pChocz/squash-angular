import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoundScoreboard} from '../shared/rest-api-dto/round-scoreboard.model';
import {Match} from '../shared/rest-api-dto/match.model';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from 'src/environments/environment';
import {formatDate} from '@angular/common';
import {Subject} from 'rxjs';
import {AuthService} from "../shared/auth.service";

@Component({
    selector: 'app-round-view-edit',
    templateUrl: './round-view-edit.component.html',
    styleUrls: ['./round-view-edit.component.css'],
})
export class RoundViewEditComponent implements OnInit, OnDestroy {
    durationInSeconds = 7;
    destroy$: Subject<boolean> = new Subject<boolean>();
    displayedColumns: string[] = [
        'first-player',
        'vsColumn',
        'second-player',
        'first-set-first-player',
        'first-set-second-player',
        'second-set-first-player',
        'second-set-second-player',
        'third-set-first-player',
        'third-set-second-player',
    ];

    uuid: string;
    roundScoreboard: RoundScoreboard;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private http: HttpClient,
                private titleService: Title,
                private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.setupComponent(params.uuid);
        });
    }

    setupComponent(roundUuid: string) {
        this.roundScoreboard = null;
        this.uuid = roundUuid;

        this.http
            .get<RoundScoreboard>(environment.apiUrl + 'scoreboards/rounds/' + this.uuid)
            .pipe(map((result) => plainToClass(RoundScoreboard, result)))
            .subscribe((result) => {
                this.roundScoreboard = result;
                this.titleService.setTitle(
                    'Editing: Round ' +
                    this.roundScoreboard.roundNumber +
                    ' | Season ' +
                    this.roundScoreboard.seasonNumber +
                    ' | ' +
                    this.roundScoreboard.leagueName
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    deleteRound(): void {
        const roundUuid: string = this.uuid;
        console.log('deleting round UUID: ' + roundUuid);

        this.http.delete(environment.apiUrl + 'rounds/' + roundUuid).subscribe(() => {
            const seasonUuid: string = this.roundScoreboard.seasonUuid;
            this.router.navigate(['season', seasonUuid]);
        });
    }

    updating(event: any): void {
        const updatedMatch: Match = event;

        this.http
            .get<RoundScoreboard>(environment.apiUrl + 'scoreboards/rounds/' + this.uuid)
            .pipe(map((result) => plainToClass(RoundScoreboard, result)))
            .subscribe(
                (result) => {
                    this.roundScoreboard = result;
                    const updatedMatchPersisted: Match = this.roundScoreboard.findMatchByUuid(updatedMatch.matchUuid);
                    this.snackBar.open('Match updated \n ' + updatedMatchPersisted.getResult(), 'X', {
                        duration: this.durationInSeconds * 1000,
                        panelClass: ['mat-toolbar', 'mat-primary', 'snackbar-pre-wrap'],
                    });
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    dateFormatted(date: Date): string {
        return formatDate(date, 'dd.MM.yyyy', 'en-US');
    }

    public onUpdate(value: boolean) {
        this.roundScoreboard.finishedState = value;

        this.http
            .put(
                environment.apiUrl + 'rounds',
                {},
                {
                    params: {
                        roundUuid: this.roundScoreboard.roundUuid,
                        finishedState: String(this.roundScoreboard.finishedState),
                    },
                }
            )
            .subscribe(
                () => {
                    console.log('Changed Round state!');
                },
                (error) => {
                    console.log('Error when changing state of the round: ', error);
                }
            );
    }
}
