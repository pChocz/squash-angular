import {Component, OnInit} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators} from "@angular/forms";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {catchError, map} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {encode} from 'url-safe-base64'
import {MyErrorStateMatcher} from "../shared/error-state-matcher";
import {SetComputeHelper} from "../shared/set-compute-helper";
import {MyLoggerService} from "../shared/my-logger.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-new-league-view',
    templateUrl: './new-league-view.component.html',
    styleUrls: ['./new-league-view.component.css']
})
export class NewLeagueViewComponent implements OnInit {

    isLoading: boolean;

    matcher = new MyErrorStateMatcher();

    leagueNameField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
    ], [
        this.leagueNameTakenValidator()
    ]);

    whenField = new FormControl('', [Validators.maxLength(100)]);

    whereField = new FormControl('', [Validators.maxLength(100)]);

    matchFormatTypes: string[] = [
        'ONE_GAME',
        'BEST_OF_3',
        'BEST_OF_5'
    ];

    setWinningTypes: string[] = [
        'ADV_OF_2_ABSOLUTE',
        'WINNING_POINTS_ABSOLUTE',
        'ADV_OF_2_OR_1_AT_THE_END'
    ];

    setFinishOption: string;

    matchFormatType: string;

    numberOfRounds: number;
    numberOfRoundsToBeDeducted: number;

    regularSetWinningType: string;
    regularSetWinningPoints: number;

    tiebreakWinningType: string;
    tiebreakWinningPoints: number;

    logoBase64: any;


    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private loggerService: MyLoggerService,
                private router: Router,
                private notificationService: NotificationService,
                private titleService: Title,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.translateService
            .get('league.new.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
                this.loggerService.log(translation);
            });

        // default values
        this.matchFormatType = 'BEST_OF_3';
        this.numberOfRounds = 10;
        this.numberOfRoundsToBeDeducted = 2;
        this.regularSetWinningType = 'ADV_OF_2_OR_1_AT_THE_END';
        this.regularSetWinningPoints = 11;
        this.tiebreakWinningType = 'WINNING_POINTS_ABSOLUTE';
        this.tiebreakWinningPoints = 9;

        this.setFinishOption = 'TIE_BREAK';

        this.http
            .get('assets/img/logo_192.png', {responseType: 'blob'})
            .subscribe({
                    next: (result) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(result);
                        reader.onload = (event: any) => {
                            this.logoBase64 = event.target.result.replace(/^data:image\/(png|jpg);base64,/, "");
                        };
                    },
                    error: (error) => {
                        this.loggerService.log(error, false)
                    }
                }
            );
    }

    submitCreateNewLeague() {
        this.isLoading = true;

        if (this.matchFormatType === 'ONE_GAME') {
            this.setFinishOption = 'NO_TIE_BREAK';
        }
        if (this.setFinishOption === 'NO_TIE_BREAK') {
            this.tiebreakWinningType = this.regularSetWinningType;
            this.tiebreakWinningPoints = this.regularSetWinningPoints;
        }

        // mandatory params
        let params = new HttpParams()
            .set('leagueName', this.leagueNameField.value)
            .set('logoBase64', encode(this.logoBase64)) // encodes to URL safe base64 string
            .set('numberOfRounds', this.numberOfRounds)
            .set('numberOfRoundsToBeDeducted', this.numberOfRoundsToBeDeducted)
            .set('matchFormatType', this.matchFormatType)
            .set('regularSetWinningType', this.regularSetWinningType)
            .set('regularSetWinningPoints', this.regularSetWinningPoints)
            .set('tiebreakWinningType', this.tiebreakWinningType)
            .set('tiebreakWinningPoints', this.tiebreakWinningPoints);

        // optional params
        if (this.whenField.value) {
            params = params.append('leagueWhen', this.whenField.value);
        }
        if (this.whereField.value) {
            params = params.append('leagueWhere', this.whereField.value);
        }

        this.http
            .post<string>(this.apiEndpointsService.getLeague(), params)
            .subscribe({
                next: (uuid) => {
                    this.router.navigate(['league-moderating', uuid]);
                },
                error: () => {
                    this.isLoading = false;
                }
            });
    }

    leagueNameTakenValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.http
                .get<Boolean>(this.apiEndpointsService.getCheckLeagueNameTaken(control.value))
                .pipe(
                    map(result => result ? {leagueNameTaken: {value: control.value}} : null),
                    catchError(() => of(null))
                )
        };
    }

    onFileSelected(event) {
        const files = event.target.files;
        const file = files[0];
        if (files && file) {
            const reader = new FileReader();
            reader.onload = this.handleFile.bind(this);
            reader.readAsBinaryString(file);
        }
    }

    handleFile(event) {
        const binaryString = event.target.result;
        this.logoBase64 = btoa(binaryString);
    }

    computeExampleSetResults(type: string, points: number): string {
        return SetComputeHelper.computeExampleSetResults(type, points);
    }

    anyFieldIsInvalid(): boolean {
        return this.leagueNameField.invalid
            || this.whenField.invalid
            || this.whereField.invalid;
    }

}
