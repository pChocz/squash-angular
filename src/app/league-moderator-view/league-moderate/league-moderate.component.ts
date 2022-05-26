import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {League} from "../../shared/rest-api-dto/league.model";
import {catchError, map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {MyErrorStateMatcher} from "../../shared/error-state-matcher";
import {NotificationService} from "../../shared/notification.service";

@Component({
    selector: 'app-league-moderate',
    templateUrl: './league-moderate.component.html',
    styleUrls: ['./league-moderate.component.css']
})
export class LeagueModerateComponent implements OnInit {

    @Input() isModerator: boolean;
    @Input() isOwner: boolean;
    @Input() leagueUuid: string;

    @Output('update') change: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    league: League;

    matcher = new MyErrorStateMatcher();

    leagueNameField = new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
    ], [
        this.leagueNameTakenValidator()
    ]);

    whenField = new FormControl('', [
        Validators.maxLength(100),
    ]);

    whereField = new FormControl('', [
        Validators.maxLength(100),
    ]);


    constructor(private http: HttpClient,
                private notificationService: NotificationService,
                private apiEndpointsService: ApiEndpointsService) {
    }

    ngOnInit(): void {
        this.setupComponent();
    }

    setupComponent() {
        this.http
            .get<League>(this.apiEndpointsService.getLeagueGeneralInfoByUuid(this.leagueUuid))
            .pipe(map((result) => plainToInstance(League, result)))
            .subscribe((result) => {
                this.league = result;
                this.leagueNameField.setValue(result.leagueName);
                this.whenField.setValue(result.time);
                this.whereField.setValue(result.location);
            });
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
        let logoBase64 = btoa(binaryString);

        this.http
            .put(this.apiEndpointsService.getLeagueModifyAsOwner(this.leagueUuid), logoBase64)
            .subscribe({
                next: () => {
                    this.notificationService.success('league.moderate.logoChangedSuccess');
                    this.setupComponent();
                    this.change.emit(true);
                }
            });
    }

    leagueNameTakenValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (control.value === this.league.leagueName) {
                return of(null);
            }
            return this.http
                .get<Boolean>(this.apiEndpointsService.getCheckLeagueNameTaken(control.value))
                .pipe(
                    map(result => result ? {leagueNameTaken: {value: control.value}} : null),
                    catchError(() => of(null))
                )
        };
    }

    anyFieldIsInvalid(): boolean {
        return this.leagueNameField.invalid
            || this.whenField.invalid
            || this.whereField.invalid;
    }

    noFieldHasBeenChanged(): boolean {
        return this.leagueNameField.value === this.league.leagueName
            && this.whereField.value === this.league.location
            && this.whenField.value === this.league.time;
    }

    updateLeagueTextParams(): void {
        let params = new HttpParams();
        if (this.leagueNameField.touched) {
            params = params.set('leagueName', this.leagueNameField.value);
        }
        if (this.whereField.touched) {
            params = params.set('location', this.whereField.value);
        }
        if (this.whenField.touched) {
            params = params.set('time', this.whenField.value);
        }

        if (this.isOwner) {
            this.http
                .put(this.apiEndpointsService.getLeagueModifyAsOwner(this.leagueUuid),
                    null,
                    {params: params}
                )
                .subscribe({
                    next: () => {
                        this.notificationService.success('league.moderate.detailsModifiedSuccess');
                        this.setupComponent();
                        this.change.emit(true);
                    }
                });

        } else if (this.isModerator) {
            this.http
                .put(this.apiEndpointsService.getLeagueModifyAsModerator(this.leagueUuid),
                    null,
                    {params: params}
                )
                .subscribe({
                    next: () => {
                        this.notificationService.success('league.moderate.detailsModifiedSuccess');
                        this.setupComponent();
                        this.change.emit(true);
                    }
                });
        }
    }

}
