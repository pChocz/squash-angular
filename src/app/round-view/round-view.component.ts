import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {RoundScoreboard} from '../shared/rest-api-dto/round-scoreboard.model';
import {plainToClass} from 'class-transformer';
import {map} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {formatDate} from '@angular/common';
import {Subject, Subscription} from 'rxjs';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {HelperService} from "../helper.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-round-view',
    templateUrl: './round-view.component.html',
    styleUrls: ['./round-view.component.css'],
})
export class RoundViewComponent implements OnInit, OnDestroy {

    destroy$: Subject<boolean> = new Subject<boolean>();
    languageChangeSub: Subscription;

    uuid: string;
    roundScoreboard: RoundScoreboard;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private apiEndpointsService: ApiEndpointsService,
        private helperService: HelperService,
        private titleService: Title,
        private translateService: TranslateService) {

        this.languageChangeSub = helperService.languageHasChanged$
            .subscribe((val: boolean) => {
                console.log('changing language in round view');
                if (this.roundScoreboard) {
                    this.setTitle();
                }
            });
    }

    setTitle() {
        this.translateService
            .get('RoundView.Title',
                {
                    roundNumber: this.roundScoreboard.roundNumber,
                    seasonNumber: this.roundScoreboard.seasonNumberRoman,
                    leagueName: this.roundScoreboard.leagueName
                }
            )
            .subscribe((res: string) => {
                this.titleService.setTitle(res);
            });

    }

    setupComponent(roundUuid: string) {
        this.roundScoreboard = null;
        this.uuid = roundUuid;

        this.http
            .get<RoundScoreboard>(this.apiEndpointsService.getRoundScoreboardByUuid(this.uuid))
            .pipe(map((result) => plainToClass(RoundScoreboard, result)))
            .subscribe((result) => {
                this.roundScoreboard = result;
                this.setTitle();
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
        this.languageChangeSub.unsubscribe();
    }

    dateFormatted(date: Date): string {
        return formatDate(date, 'dd.MM.yyyy', 'en-US');
    }

    printRound() {
        window.print();
    }

}
