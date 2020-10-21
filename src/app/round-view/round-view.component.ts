import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {RoundScoreboard} from '../shared/rest-api-dto/round-scoreboard.model';
import {plainToClass} from 'class-transformer';
import {map} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {environment} from 'src/environments/environment';
import {formatDate} from '@angular/common';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-round-view',
    templateUrl: './round-view.component.html',
    styleUrls: ['./round-view.component.css'],
})
export class RoundViewComponent implements OnInit, OnDestroy {
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

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private titleService: Title) {

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
                    'Round ' +
                    this.roundScoreboard.roundNumber +
                    ' | Season ' +
                    this.roundScoreboard.seasonNumberRoman +
                    ' | ' +
                    this.roundScoreboard.leagueName
                );
            });
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.setupComponent(params.uuid);
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    dateFormatted(date: Date): string {
        return formatDate(date, 'dd.MM.yyyy', 'en-US');
    }
}
