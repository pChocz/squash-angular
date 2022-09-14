import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MyLoggerService} from "../shared/my-logger.service";
import {AuthService} from "../shared/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../shared/notification.service";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {Match} from "../shared/rest-api-dto/match.model";
import {MatchScore} from "../shared/rest-api-dto/match-score.model";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {timer} from "rxjs";

@Component({
    selector: 'app-match-referee-sheet',
    templateUrl: './match-referee-sheet.component.html',
    styleUrls: ['./match-referee-sheet.component.scss']
})
export class MatchRefereeSheetComponent implements OnInit {

    distractFreeMode: boolean;
    @BlockUI() blockUI: NgBlockUI;

    availableTabs = [
        'referee-sheet',
        'score-tables',
        'score-logs'
    ];

    matchDurationMillis: number;
    currentGameDurationMillis: number;

    tab: string;
    selectedTabIndex = 0;

    matchUuid: string;
    match: Match;
    scoreSheetsGroupedByGame: Map<number, MatchScore[]>;

    currentServePlayer: string;
    currentServeSide: string;

    constructor(private route: ActivatedRoute,
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
        this.distractFreeMode = true;
        this.currentServeSide = 'LEFT_SIDE';
        this.currentServePlayer = 'FIRST_PLAYER';
        this.route
            .params
            .subscribe((params) => {
                if (params.uuid !== this.matchUuid) {
                    this.setupComponent(params.uuid);
                    this.matchUuid = params['uuid'];
                }
                this.tab = params['tab'];
                this.switchTab(this.availableTabs.indexOf(this.tab));
            });
    }

    setupComponent(roundUuid: string) {
        this.matchUuid = roundUuid;

        this.http
            .get<Match>(this.apiEndpointsService.getMatchScore(this.matchUuid))
            .pipe(map((result) => plainToInstance(Match, result)))
            .subscribe((result) => {
                this.translateService
                    .get('match.scoreSheet.title')
                    .subscribe((res: string) => {
                        let title: string = res + ' - ' + result.firstPlayer.username + ' v. ' + result.secondPlayer.username
                        this.titleService.setTitle(title);
                        this.loggerService.log(title);
                    });
                this.updateMatch(result)
            });
    }

    toggleCurrentServe(player: string) {
        if (this.currentServePlayer === player) {
            if (this.currentServeSide === 'LEFT_SIDE') {
                this.currentServeSide = 'RIGHT_SIDE';
            } else {
                this.currentServeSide = 'LEFT_SIDE';
            }
        } else {
            this.currentServePlayer = player;
        }
    }

    revertScore() {
        this.blockUI.start();
        this.http
            .delete<Match>(this.apiEndpointsService.getMatchScoreLast(this.matchUuid))
            .pipe(map((result) => plainToInstance(Match, result)))
            .subscribe({
                next: (result: Match) => {
                    this.updateMatch(result);
                    this.blockUI.stop();
                },
                error: () => {
                    this.blockUI.stop();
                }
            });
    }

    clearAll() {
        this.blockUI.start();
        this.http
            .delete<Match>(this.apiEndpointsService.getMatchScoreAll(this.matchUuid))
            .pipe(map((result) => plainToInstance(Match, result)))
            .subscribe({
                next: (result: Match) => {
                    this.updateMatch(result);
                    this.blockUI.stop();
                },
                error: () => {
                    this.blockUI.stop();
                }
            });
    }

    addRallyScore(scoreEventType: string, appealDecision: string) {
        let matchScore = new MatchScore();
        matchScore.scoreEventType = scoreEventType;
        matchScore.appealDecision = appealDecision;
        matchScore.serveSide = this.currentServeSide;
        matchScore.servePlayer = this.currentServePlayer;
        this.postMatchScore(matchScore);
    }

    addNonRallyScore(scoreEventType: string) {
        let matchScore = new MatchScore();
        matchScore.scoreEventType = scoreEventType;
        this.postMatchScore(matchScore);
    }

    switchTab(index: number): void {
        if (index === -1) {
            index = 0;
        }
        this.selectedTabIndex = index;
        this.router.navigate(['/match-referee-sheet', this.matchUuid, this.availableTabs[index]]);
    }

    getLastScoreForPlayer(player: string): string {
        let lastMatchScore = this.match.getLastMatchScore();

        if (lastMatchScore === undefined) {
            return '--';
        } else if (player === 'FIRST_PLAYER' && lastMatchScore.firstPlayerScore !== undefined) {
            return String(lastMatchScore.firstPlayerScore);
        } else if (player === 'SECOND_PLAYER' && lastMatchScore.secondPlayerScore !== undefined) {
            return String(lastMatchScore.secondPlayerScore);
        } else {
            return '--';
        }
    }

    getLastScoreGamesWonForPlayer(player: string): string {
        let lastMatchScore = this.match.getLastMatchScore();

        if (lastMatchScore === undefined) {
            return '--';
        } else if (player === 'FIRST_PLAYER') {
            return String(lastMatchScore.firstPlayerGamesWon);
        } else if (player === 'SECOND_PLAYER') {
            return String(lastMatchScore.secondPlayerGamesWon);
        } else {
            return '--';
        }
    }

    canUndoOrReset(): boolean {
        return this.match.getLastMatchScore() !== undefined;
    }

    canStartMatch(): boolean {
        return this.match.getLastMatchScore() === undefined;
    }

    canEndMatch(): boolean {
        let lastMatchScore = this.match.getLastMatchScore();
        if (lastMatchScore === undefined) {
            return false;
        }
        return lastMatchScore.canEndMatch;
    }

    canStartGame(): boolean {
        let lastMatchScore = this.match.getLastMatchScore();
        if (lastMatchScore === undefined) {
            return false;
        }
        return lastMatchScore.canStartGame;
    }

    canEndGame(): boolean {
        let lastMatchScore = this.match.getLastMatchScore();
        if (lastMatchScore === undefined) {
            return false;
        }
        return lastMatchScore.canEndGame;
    }

    canScore(): boolean {
        let lastMatchScore = this.match.getLastMatchScore();
        if (lastMatchScore === undefined) {
            return false;
        }
        return lastMatchScore.canScore;
    }

    canReferee() {
        return this.match.status === 'EMPTY'
            || this.match.matchScores.length > 0;
    }

    private postMatchScore(matchScore: MatchScore) {
        this.blockUI.start();
        this.http
            .post<Match>(this.apiEndpointsService.getMatchScore(this.matchUuid), matchScore)
            .pipe(map((result) => plainToInstance(Match, result)))
            .subscribe({
                next: (result: Match) => {
                    this.updateMatch(result);
                    this.blockUI.stop();
                },
                error: () => {
                    this.blockUI.stop();
                }
            });
    }

    private updateMatch(result: Match) {
        this.match = result;
        let lastMatchScore = this.match.getLastMatchScore();

        if (lastMatchScore
            && lastMatchScore.nextSuggestedServePlayer
            && lastMatchScore.nextSuggestedServeSide) {
            this.currentServeSide = lastMatchScore.nextSuggestedServeSide;
            this.currentServePlayer = lastMatchScore.nextSuggestedServePlayer;
        } else {
            this.currentServeSide = 'LEFT_SIDE';
            this.currentServePlayer = 'FIRST_PLAYER';
        }

        this.scoreSheetsGroupedByGame = this.match
            .matchScores
            .filter(v => v.gameNumber !== undefined)
            .reduce(
                (entryMap, e) => {
                    return entryMap.set(
                        e.gameNumber,
                        [...entryMap.get(e.gameNumber) || [], e]
                    );
                },
                new Map()
            );

        timer(1000, 1000)
            .pipe(
                map((x: number) => {
                    let lastGameScore = this.match.getLastMatchScoreStartingWith("MATCH_");
                    if (lastGameScore && lastGameScore.scoreEventType === 'MATCH_BEGINS') {
                        let zonedDateTime = lastGameScore.zonedDateTime;
                        return new Date().getTime() - new Date(zonedDateTime).getTime() + x;
                    } else {
                        return undefined;
                    }
                })
            )
            .subscribe(t => this.matchDurationMillis = t);

        timer(1000, 1000)
            .pipe(
                map((x: number) => {
                    let lastGameScore = this.match.getLastMatchScoreStartingWith("GAME_");
                    if (lastGameScore && lastGameScore.scoreEventType === 'GAME_BEGINS') {
                        let zonedDateTime = lastGameScore.zonedDateTime;
                        return new Date().getTime() - new Date(zonedDateTime).getTime() + x;
                    } else {
                        return undefined;
                    }
                })
            )
            .subscribe(t => this.currentGameDurationMillis = t);
    }

    onResetClick(): void {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            maxWidth: '80%',
            width: '500px',
            data: {message: 'match.scoreSheet.actions.resetConfirmationMessage', isRemoval: true},
            autoFocus: false
        });

        confirmationDialogRef.afterClosed()
            .subscribe({
                next: (result) => {
                    if (result === true) {
                        this.clearAll();
                    }
                }
            });
    }

    toggleDistractFreeMode() {
        this.distractFreeMode = this.distractFreeMode !== true;
    }

}
