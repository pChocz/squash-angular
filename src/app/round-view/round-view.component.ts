import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {RoundScoreboard} from '../shared/rest-api-dto/round-scoreboard.model';
import {plainToInstance} from 'class-transformer';
import {map} from 'rxjs/operators';
import {Title} from '@angular/platform-browser';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {MyLoggerService} from "../shared/my-logger.service";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../shared/auth.service";
import {NotificationService} from "../shared/notification.service";
import {Message} from "@stomp/stompjs";
import {RxStompService} from "../shared/rx-stomp.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-round-view',
    templateUrl: './round-view.component.html',
    styleUrls: ['./round-view.component.css'],
})
export class RoundViewComponent implements OnInit, OnDestroy {

    websocketSubscription: Subscription;
    uuid: string;
    tab: number;
    roundScoreboard: RoundScoreboard;
    leagueLogoBytes: string;
    previousRoundUuid: string;
    nextRoundUuid: string;
    editMode: boolean;
    isModerator: boolean;
    isOwner: boolean;

    constructor(
        public rxStompService: RxStompService,
        private route: ActivatedRoute,
        private loggerService: MyLoggerService,
        private authService: AuthService,
        private dialog: MatDialog,
        private http: HttpClient,
        private notificationService: NotificationService,
        private apiEndpointsService: ApiEndpointsService,
        private router: Router,
        private titleService: Title,
        private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe((params) => {
                if (params.uuid !== this.uuid) {
                    this.setupComponent(params.uuid);
                }
                this.tab = params['tab'];
                this.switchTab(this.tab);
            });
    }

    ngOnDestroy(): void {
        this.websocketSubscription.unsubscribe();
    }

    setupComponent(roundUuid: string) {
        if (this.websocketSubscription) {
            this.websocketSubscription.unsubscribe();
        }
        this.websocketSubscription = this.rxStompService
            .watch('/round-scoreboard/' + roundUuid)
            .subscribe((message: Message) => {
                this.roundScoreboard = plainToInstance(RoundScoreboard, JSON.parse(message.body));
                this.editMode = !this.roundScoreboard.finishedState;
                this.notificationService.success("round.hasBeenUpdated");
            });

        this.roundScoreboard = null;
        this.uuid = roundUuid;

        this.http
            .get<any>(this.apiEndpointsService.getAdjacentRounds(this.uuid))
            .subscribe((result) => {
                this.previousRoundUuid = result.first;
                this.nextRoundUuid = result.second;
            });

        this.http
            .get<RoundScoreboard>(this.apiEndpointsService.getRoundScoreboardByUuid(this.uuid))
            .pipe(map((result) => plainToInstance(RoundScoreboard, result)))
            .subscribe((result) => {
                this.roundScoreboard = result;
                this.editMode = !this.roundScoreboard.finishedState;
                const leagueUuid = this.roundScoreboard.leagueUuid;
                this.authService.hasValidToken() && this.authService.hasRoleForLeague(leagueUuid, 'MODERATOR', false)
                    .then((result) => {
                            this.isModerator = result;
                        }
                    );
                this.authService.hasValidToken() && this.authService.hasRoleForLeague(leagueUuid, 'OWNER', false)
                    .then((result) => {
                            this.isOwner = result;
                        }
                    );
                this.translateService
                    .get('dynamicTitles.round',
                        {
                            roundNumber: this.roundScoreboard.roundNumber,
                            seasonNumber: this.roundScoreboard.seasonNumberRoman,
                            leagueName: this.roundScoreboard.leagueName
                        }
                    )
                    .subscribe((res: string) => {
                        this.titleService.setTitle(res);
                        this.loggerService.log(res);
                    });
                this.loadLogo();
            });
    }

    printRound() {
        window.print();
    }

    switchTab(index: number): void {
        if (index === -1) {
            index = 0;
        }
        this.tab = index;
        this.router.navigate(['/round', this.uuid, this.tab]);
    }

    updating(): void {
        this.http
            .get<RoundScoreboard>(this.apiEndpointsService.getRoundScoreboardByUuid(this.uuid))
            .pipe(map((result) => plainToInstance(RoundScoreboard, result)))
            .subscribe({
                next: (result) => {
                    this.roundScoreboard = result;
                }
            });
    }

    public toggleRoundState() {
        const newVal: boolean = !this.roundScoreboard.finishedState;

        this.http
            .put(this.apiEndpointsService.getRoundStateUpdate(this.roundScoreboard.roundUuid, newVal), {})
            .subscribe({
                next: () => {
                    this.notificationService.success(newVal
                        ? 'round.statusChanged.finished'
                        : 'round.statusChanged.edit'
                    );
                },
                complete: () => {
                    this.setupComponent(this.uuid);
                }
            });
    }

    roundRemoveConfirmationDialog(): void {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'round.remove.areYouSure', isRemoval: true},
            autoFocus: false
        });

        confirmationDialogRef.afterClosed()
            .subscribe(
                result => {
                    if (result === true) {
                        const seasonUuid = this.roundScoreboard.seasonUuid;
                        this.roundScoreboard = null;
                        this.http
                            .delete(this.apiEndpointsService.getRoundByUuid(this.uuid))
                            .subscribe(() => {
                                this.router.navigate(['season', seasonUuid]);
                            });
                    }
                });
    }

    private loadLogo(): void {
        this.http
            .get(this.apiEndpointsService.getLeagueLogoByRoundUuid(this.uuid), {responseType: 'text'})
            .subscribe((result) => {
                this.leagueLogoBytes = result;
            });
    }

}
