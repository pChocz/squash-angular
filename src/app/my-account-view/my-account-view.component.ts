import {Component, OnInit} from '@angular/core';
import {map, takeUntil} from "rxjs/operators";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {plainToClass} from "class-transformer";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {ChangePasswordDialogComponent} from "./change-password-dialog.component";
import {FormControl, Validators} from "@angular/forms";
import {League} from "../shared/rest-api-dto/league.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ChangeEmojiDialogComponent} from "./change-emoji-dialog.component";
import {MyLoggerService} from "../shared/my-logger.service";
import {environment} from 'src/environments/environment';
import {Globals} from "../globals";


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

  emailField = new FormControl('', [
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
              private snackBar: MatSnackBar,
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
      width: '300px'
    });
  }

  openEmojiChangeDialog(): void {
    const dialogRef = this.dialog.open(ChangeEmojiDialogComponent, {
      width: '325px',
      data: {emoji: this.currentPlayer.emoji}
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
    .subscribe(
        () => {
          console.log("Email change requested successfully");
          this.emailChangeStatus = 'SUCCESS';
        },
        (error) => {
          console.log("Email change request ERROR");
          this.emailChangeStatus = 'ERROR';
          this.emailField.setValue(this.currentPlayer.email);
        }
    );
  }

  joinLeague(): void {
    let leagueUuid = this.selectedLeague.leagueUuid;

    this.http
    .put(this.apiEndpointsService.getJoinLeagueRoles(leagueUuid), {})
    .subscribe(
        () => {
          console.log("League joined succesfully");
          this.leagueJoinStatus = 'SUCCESS';
          this.initializePlayer();
          this.selectedLeague = null;


          this.translateService
          .get('myAccount.joinLeague.success')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: 7 * 1000,
              panelClass: ['mat-toolbar', 'mat-primary'],
            });
          });


        },
        (error) => {
          console.log("League join ERROR");
          this.leagueJoinStatus = 'ERROR';
          this.leagueToJoinOrLeave = '';
          this.selectedLeague = null;

          this.translateService
          .get('myAccount.joinLeague.error')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: 7 * 1000,
              panelClass: ['mat-toolbar', 'mat-warn'],
            });
          });
        }
    );

  }

  leaveLeague(): void {
    this.http
    .delete(this.apiEndpointsService.getLeaveLeagueRoles(this.selectedLeague.leagueUuid))
    .subscribe(
        () => {
          console.log("League left succesfully");
          this.leagueJoinStatus = 'SUCCESS';
          this.initializePlayer();
          this.selectedLeague = null;


          this.translateService
          .get('myAccount.leaveLeague.success')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: 7 * 1000,
              panelClass: ['mat-toolbar', 'mat-primary'],
            });
          });


        },
        (error) => {
          console.log("League leave ERROR");
          this.leagueJoinStatus = 'ERROR';
          this.leagueToJoinOrLeave = '';
          this.selectedLeague = null;

          this.translateService
          .get('myAccount.leaveLeague.error')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: 7 * 1000,
              panelClass: ['mat-toolbar', 'mat-warn'],
            });
          });
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
        map((result) => plainToClass(PlayerDetailed, result)),
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
    .pipe(map((result) => plainToClass(League, result)))
    .subscribe((result) => {
      this.leagues = result;
    });
  }

}
