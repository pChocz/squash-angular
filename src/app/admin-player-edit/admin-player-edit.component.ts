import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {PlayerDetailed} from "../shared/rest-api-dto/player-detailed.model";
import {catchError, map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {ChangeEmojiDialogComponent} from "../my-account-view/change-emoji-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {CustomValidators} from "../shared/custom-validators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-admin-player-edit',
  templateUrl: './admin-player-edit.component.html',
  styleUrls: ['./admin-player-edit.component.css']
})
export class AdminPlayerEditComponent implements OnInit {

  playerUuid: string;
  player: PlayerDetailed;

  usernameField = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(30),
    CustomValidators.noSpecialCharactersValidator()
  ], [
    this.usernameOrEmailTakenValidator()
  ]);

  emailField = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(100)
  ], [
    this.usernameOrEmailTakenValidator()
  ]);

  constructor(private route: ActivatedRoute,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private titleService: Title,
              private loggerService: MyLoggerService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.playerUuid = params.uuid;
      this.initializePlayer();
      this.titleService.setTitle('Admin player edit | ' + this.player.username);
      this.loggerService.log('Admin player edit | ' + this.player.username);
    });
  }

  initializePlayer(): void {
    this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getPlayer(this.playerUuid))
    .pipe(map((result) => plainToClass(PlayerDetailed, result)))
    .subscribe((result) => {
      this.player = result;
      this.emailField.setValue(this.player.email);
      this.usernameField.setValue(this.player.username);
    });
  }

  openEmojiChangeDialog(): void {
    const dialogRef = this.dialog.open(ChangeEmojiDialogComponent, {
      width: '325px',
      data: {emoji: this.player.emoji, playerUuid: this.playerUuid}
    }).afterClosed().subscribe(() => {
      this.initializePlayer();
    });
  }

  usernameOrEmailTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (control.value === this.player.email
          || control.value === this.player.username) {
        return of(null);
      }
      return this.http
      .get<Boolean>(this.apiEndpointsService.getCheckUsernameOrEmailTaken(control.value))
      .pipe(
          map(result => result ? {usernameOrEmailTaken: {value: control.value}} : null),
          catchError(() => of(null))
      )
    };
  }

  changeUsernameAndEmail(): void {
    this.http
    .put(this.apiEndpointsService.getPlayer(this.player.uuid),
        {},
        {
          params: {
            username: this.usernameField.value,
            email: this.emailField.value
          }
        }
    )
    .subscribe(
        () => {
          this.initializePlayer();
          this.snackBar.open('Modified parameters for player [' + this.player.username + ']', 'X', {
            duration: 5 * 1000,
            panelClass: ['mat-toolbar', 'mat-primary'],
          });
        }
    );
  }

}
