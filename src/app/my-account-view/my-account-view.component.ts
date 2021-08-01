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

@Component({
  selector: 'app-my-account-view',
  templateUrl: './my-account-view.component.html',
  styleUrls: ['./my-account-view.component.css']
})
export class MyAccountViewComponent implements OnInit {

  currentPlayer: PlayerDetailed;
  emailChangeStatus: string = '';
  leagueJoinStatus: string = '';

  emailField = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(100)
  ]);

  leagueToJoinOrLeave: string = '';

  private ngUnsubscribe = new Subject();

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
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
    });

    this.initializePlayer();
  }

  openPasswordChangeDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '300px'
    });
  }

  changeEmail(): void {
    this.http
    .put(this.apiEndpointsService.getChangeMyEmail(),
        {},
        {
          params: {
            newEmail: this.emailField.value
          },
        }
    )
    .subscribe(
        () => {
          console.log("Email changed succesfully");
          this.emailChangeStatus = 'SUCCESS';
          this.currentPlayer.email = this.emailField.value;
        },
        (error) => {
          console.log("Email change ERROR");
          this.emailChangeStatus = 'ERROR';
          this.emailField.setValue(this.currentPlayer.email);
        }
    );
  }

  joinLeague(): void {
    this.http
    .put(this.apiEndpointsService.getJoinNewLeague(),
        {},
        {
          params: {
            leagueName: this.leagueToJoinOrLeave
          },
        }
    )
    .subscribe(
        () => {
          console.log("League joined succesfully");
          this.leagueJoinStatus = 'SUCCESS';
          this.initializePlayer();
        },
        (error) => {
          console.log("League join ERROR");
          this.leagueJoinStatus = 'ERROR';
          this.leagueToJoinOrLeave = '';
        }
    );
  }

  leaveLeague(): void {
    this.http
    .put(this.apiEndpointsService.getLeaveLeague(),
        {},
        {
          params: {
            leagueName: this.leagueToJoinOrLeave
          },
        }
    )
    .subscribe(
        () => {
          console.log("League left succesfully");
          this.leagueJoinStatus = 'SUCCESS';
          this.initializePlayer();
        },
        (error) => {
          console.log("League leave ERROR");
          this.leagueJoinStatus = 'ERROR';
          this.leagueToJoinOrLeave = '';
        }
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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

}
