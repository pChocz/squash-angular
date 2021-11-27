import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MyLoggerService} from "../shared/my-logger.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../environments/environment";
import {Globals} from "../globals";

@Component({
  selector: 'app-request-magic-link-view',
  templateUrl: './request-magic-link-view.component.html',
  styleUrls: ['./request-magic-link-view.component.css']
})
export class RequestMagicLinkViewComponent implements OnInit {

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
    .get('loginUsingMagicLink.title')
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
    .set('email', emailToSend)
    .set('frontendUrl', environment.frontendUrl)
    .set('lang', localStorage.getItem(Globals.STORAGE_LANGUAGE_KEY));

    this.http
    .post<any>(this.apiEndpointsService.getRequestMagicLoginLink(), params)
    .subscribe(
        () => {
          this.isLoading = false;
          this.translateService
          .get('loginUsingMagicLink.ifExists', {email: emailToSend})
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
