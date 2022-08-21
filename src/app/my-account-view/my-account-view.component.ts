import {Component, OnInit} from '@angular/core';
import {map, takeUntil} from "rxjs/operators";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {plainToInstance} from "class-transformer";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ChangePasswordDialogComponent} from "./change-password-dialog.component";
import {UntypedFormControl, Validators} from "@angular/forms";
import {League} from "../shared/rest-api-dto/league.model";
import {ChangeEmojiDialogComponent} from "./change-emoji-dialog.component";
import {MyLoggerService} from "../shared/my-logger.service";
import {environment} from 'src/environments/environment';
import {Globals} from "../globals";
import {NotificationService} from "../shared/notification.service";


@Component({
    selector: 'app-my-account-view',
    templateUrl: './my-account-view.component.html',
    styleUrls: ['./my-account-view.component.css']
})
export class MyAccountViewComponent implements OnInit {

    currentPlayer: PlayerDetailed;
    emailChangeStatus: string = '';
    emailChangeRequestSent: boolean;
    leagueJoinStatus: string = '';

    emailField = new UntypedFormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
    ]);

    leagueToJoinOrLeave: string = '';

    emojis: string[];
    leagues: League[];
    selectedLeague: League;

    private ngUnsubscribe = new Subject();

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private loggerService: MyLoggerService,
                private notificationService: NotificationService,
                private titleService: Title,
                private dialog: MatDialog,
                private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.translateService
            .get('menu.myAccount')
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((res: string) => {
                this.titleService.setTitle(res);
                this.loggerService.log(res);
            });

        this.initializePlayer();
        this.initializeLeagues();
    }

    openPasswordChangeDialog(): void {
        const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
            width: '300px',
            autoFocus: false
        });
    }

    openEmojiChangeDialog(): void {
        const dialogRef = this.dialog.open(ChangeEmojiDialogComponent, {
            width: '400px',
            data: {emoji: this.currentPlayer.emoji},
            autoFocus: false
        }).afterClosed().subscribe(() => {
            this.initializePlayer();
        });
    }

    requestEmailChange(): void {
        this.emailChangeRequestSent = true;
        this.emailChangeStatus = 'REQUESTING';

        this.http
            .post(this.apiEndpointsService.getRequestEmailChange(),
                {},
                {
                    params: {
                        newEmail: this.emailField.value,
                        frontendUrl: environment.frontendUrl,
                        lang: localStorage.getItem(Globals.STORAGE_LANGUAGE_KEY)
                    },
                }
            )
            .subscribe({
                next: () => {
                    this.emailChangeStatus = 'SUCCESS';
                },
                error: () => {
                    this.emailChangeStatus = 'ERROR';
                    this.emailField.setValue(this.currentPlayer.email);
                }
            });
    }

    joinLeague(): void {
        let leagueUuid = this.selectedLeague.leagueUuid;

        this.http
            .put(this.apiEndpointsService.getJoinLeagueRoles(leagueUuid), {})
            .subscribe({
                    next: () => {
                        this.leagueJoinStatus = 'SUCCESS';
                        this.initializePlayer();
                        this.selectedLeague = null;
                        this.notificationService.success('myAccount.joinLeague.success');

                    },
                    error: () => {
                        this.leagueJoinStatus = 'ERROR';
                        this.leagueToJoinOrLeave = '';
                        this.selectedLeague = null;
                        this.notificationService.success('myAccount.joinLeague.error');
                    }
                }
            );

    }

    leaveLeague(): void {
        this.http
            .delete(this.apiEndpointsService.getLeaveLeagueRoles(this.selectedLeague.leagueUuid))
            .subscribe(
                () => {
                    this.leagueJoinStatus = 'SUCCESS';
                    this.initializePlayer();
                    this.selectedLeague = null;
                    this.notificationService.success('myAccount.leaveLeague.success');
                },
                (error) => {
                    this.leagueJoinStatus = 'ERROR';
                    this.leagueToJoinOrLeave = '';
                    this.selectedLeague = null;
                    this.notificationService.success('myAccount.leaveLeague.error');
                }
            );
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next('1');
        this.ngUnsubscribe.complete();
    }

    isMemberOfSelectedLeague(): boolean {
        if (!this.selectedLeague) {
            return false;
        }
        return this.currentPlayer.hasAnyRoleForLeague(this.selectedLeague.leagueUuid);
    }

    myLeaguesWithRole(role: string): string {
        return this
            .currentPlayer
            .leagueRoles
            .filter(leagueRole => leagueRole.leagueRole === role)
            .map(leagueRole => leagueRole.leagueName)
            .join(", ");
    }

    private initializePlayer() {
        this.http
            .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
            .pipe(
                map((result) => plainToInstance(PlayerDetailed, result)),
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(
                result => {
                    this.currentPlayer = result
                    this.emailField.setValue(result.email);
                }
            );
    }

    private initializeLeagues() {
        this.http
            .get<League[]>(this.apiEndpointsService.getAllLeaguesGeneralInfo())
            .pipe(map((result) => plainToInstance(League, result)))
            .subscribe((result) => {
                this.leagues = result;
            });
    }

}
