import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators} from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Title} from '@angular/platform-browser';
import {PlayerDetailed} from '../shared/rest-api-dto/player-detailed.model';
import {plainToClass} from 'class-transformer';
import {catchError, map} from 'rxjs/operators';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";
import {TokenDecodeService} from "../shared/token-decode.service";
import {MyLoggerService} from "../shared/my-logger.service";
import {Observable, of} from "rxjs";
import {MyErrorStateMatcher} from "../shared/error-state-matcher";

@Component({
  selector: 'app-reset-password-view',
  templateUrl: './reset-password-view.component.html',
  styleUrls: ['./reset-password-view.component.css'],
})
export class ResetPasswordViewComponent implements OnInit {

    matcher = new MyErrorStateMatcher();


    durationInSeconds = 7;

  passwordField = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
  ], [
      this.passwordStrengthValidator()
  ]);

  hide: boolean;
  token: string;
  username: string;
  email: string;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private route: ActivatedRoute,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private loggerService: MyLoggerService,
              private tokenDecodeService: TokenDecodeService,
              private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService
    .get('resetPassword.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
      this.loggerService.log(translation);
    });

    this.hide = true;
    this.passwordField.markAsTouched();
    this.route.params.subscribe((params) => (this.token = params.token));
    this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getPlayerByPasswordResetToken(this.token))
    .pipe(map((result) => plainToClass(PlayerDetailed, result)))
    .subscribe(
        result => {
          const player: PlayerDetailed = result;
          this.username = player.username;
          this.email = player.email;
        },
        error => {
          this.router.navigate([`/forgot-password`]);
        });
  }

  resetPassword(): void {
    const newPassword: string = this.passwordField.value;
    this.passwordField.setValue('');

    const params = new HttpParams()
    .set('passwordChangeToken', this.token)
    .set('newPassword', newPassword);

    this.http
    .post<any>(this.apiEndpointsService.getPasswordReset(), params)
    .subscribe(
        tokens => {

          console.log("TOKENS: " + tokens);

          const newBearerToken = tokens.jwtAccessToken;
          const newRefreshToken = tokens.refreshToken;
          localStorage.setItem(Globals.STORAGE_JWT_TOKEN_KEY, newBearerToken);
          localStorage.setItem(Globals.STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);
          console.log("Password reset succesfull. Tokens have also been set properly");

          this.tokenDecodeService.refresh();

          this.router.navigate([`/dashboard`]);

          this.translateService
          .get('resetPassword.successReset')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-primary'],
            });
          });
        },
        (error) => {
          this.translateService
          .get('resetPassword.errorReset')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-warn'],
            });
          });
        }
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.passwordField.valid) {
      this.resetPassword();
    }
  }

    getErrorMessageForPasswordField(): string {
        if (this.passwordField.hasError('required')) {
            return 'fieldValidation.error.required';

        } else if (
            this.passwordField.hasError('minlength') ||
            this.passwordField.hasError('maxlength')) {
            return 'fieldValidation.error.min5Max100';

        } else if (
            this.passwordField.hasError('commonPassword')) {
            return 'fieldValidation.error.commonPassword';

        } else {
            return '';
        }
    }

    passwordStrengthValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.http
                .post<Boolean>(this.apiEndpointsService.getCheckPasswordStrength(),
                    {},
                    {
                      params: {
                        password: control.value
                      },
                    })
            .pipe(
                    map(result => result ? {commonPassword: {value: control.value}} : null),
                    catchError(() => of(null))
                )
        };
    }

}
