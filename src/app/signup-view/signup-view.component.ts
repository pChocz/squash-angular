import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, AsyncValidatorFn, FormControl, ValidationErrors, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Title} from '@angular/platform-browser';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {CustomValidators} from "../shared/custom-validators";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {MyErrorStateMatcher} from "../shared/error-state-matcher";
import {Globals} from "../globals";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-signup-view',
  templateUrl: './signup-view.component.html',
  styleUrls: ['./signup-view.component.css'],
})
export class SignupViewComponent implements OnInit {

  matcher = new MyErrorStateMatcher();

  durationInSeconds = 7;

  emailField = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(100)
  ], [
    this.usernameOrEmailTakenValidator()
  ]);

  usernameField = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(30),
    CustomValidators.noSpecialCharactersValidator()
  ], [
    this.usernameOrEmailTakenValidator()
  ]);

  passwordField = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100),
  ], [
    this.passwordStrengthValidator()
  ]);

  hide: boolean;
  registering: boolean;

  constructor(private router: Router,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private loggerService: MyLoggerService,
              private snackBar: MatSnackBar,
              private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService
    .get('signUp.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
      this.loggerService.log(translation);
    });

    this.hide = true;
    this.registering = false;
  }

  signup(): void {
    this.registering = true;

    const username: string = this.usernameField.value;
    const email: string = this.emailField.value;
    const password: string = this.passwordField.value;

    this.usernameField.setValue('');
    this.emailField.setValue('');
    this.passwordField.setValue('');

    const params = new HttpParams()
    .set('username', username)
    .set('email', email)
    .set('password', password)
    .set('frontendUrl', environment.frontendUrl)
    .set('lang', localStorage.getItem(Globals.STORAGE_LANGUAGE_KEY));

    this.http
    .post<number>(this.apiEndpointsService.getSignup(), params)
    .subscribe(
        () => {
          this.translateService
          .get('signUp.successfull')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-primary'],
            });
          });
          this.router.navigate([`/login`]);
        },
        (error) => {
          console.log(error);
          this.translateService
          .get('signUp.credentialsTaken')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, "X", {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          });
          this.registering = false;
          this.router.navigate([`/register`]);
        }
    );
  }

  isValidInput(): boolean {
    return (
        this.emailField.valid &&
        this.usernameField.valid &&
        this.passwordField.valid
    );
  }

  getErrorMessageForEmailField(): string {
    if (this.emailField.hasError('required')) {
      return 'fieldValidation.error.required';

    } else if (this.emailField.hasError('email')) {
      return 'fieldValidation.error.email';

    } else if (this.emailField.hasError('usernameOrEmailTaken')) {
      return 'fieldValidation.error.nameTaken';

    } else {
      return '';
    }
  }

  getErrorMessageForUsernameField(): string {
    if (this.usernameField.hasError('required')) {
      return 'fieldValidation.error.required';

    } else if (this.usernameField.hasError('noSpecialCharacters')) {
      return 'fieldValidation.error.noSpecialCharactersAllowed';

    } else if (this.usernameField.hasError('usernameOrEmailTaken')) {
      return 'fieldValidation.error.nameTaken';

    } else if (
        this.usernameField.hasError('minlength') ||
        this.usernameField.hasError('maxlength')) {
      return 'fieldValidation.error.min5Max30';

    } else {
      return '';
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

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.isValidInput()) {
      this.signup();
    }
  }

  usernameOrEmailTakenValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.http
      .get<Boolean>(this.apiEndpointsService.getCheckUsernameOrEmailTaken(control.value))
      .pipe(
          map(result => result ? {usernameOrEmailTaken: {value: control.value}} : null),
          catchError(() => of(null))
      )
    };
  }

  passwordStrengthValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.http
          .get<Boolean>(this.apiEndpointsService.getCheckPasswordStrength(control.value))
          .pipe(
              map(result => result ? {commonPassword: {value: control.value}} : null),
              catchError(() => of(null))
          )
    };
  }

}
