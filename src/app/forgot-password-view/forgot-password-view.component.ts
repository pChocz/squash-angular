import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Title} from '@angular/platform-browser';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-forgot-password-view',
  templateUrl: './forgot-password-view.component.html',
  styleUrls: ['./forgot-password-view.component.css'],
})
export class ForgotPasswordViewComponent implements OnInit {

  durationInSeconds = 7;

  emailField = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(100)
  ]);

  isLoading: boolean;

  constructor(private snackBar: MatSnackBar,
              private apiEndpointsService: ApiEndpointsService,
              private http: HttpClient,
              private loggerService: MyLoggerService,
              private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService
    .get('forgotPassword.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
      this.loggerService.log(translation);
    });
    this.isLoading = false;
  }

  resetPassword(): void {
    this.isLoading = true;

    const emailToSend: string = this.emailField.value;
    this.emailField.setValue('');

    const params = new HttpParams()
    .set('usernameOrEmail', emailToSend)
    .set('frontendUrl', environment.frontendUrl)
    .set('lang', localStorage.getItem(Globals.STORAGE_LANGUAGE_KEY));

    this.http
    .post<any>(this.apiEndpointsService.getRequestPasswordReset(), params)
    .subscribe(
        () => {
          this.isLoading = false;
          this.translateService
          .get('forgotPassword.ifExists', {email: emailToSend})
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-primary'],
            });
          });
        },
        (error) => {
          this.isLoading = false;
          console.log('ERROR!', error);
        }
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.emailField.valid) {
      this.resetPassword();
    }
  }

}
