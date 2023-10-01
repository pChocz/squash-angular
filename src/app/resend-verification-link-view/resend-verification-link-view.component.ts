import {Component, HostListener, OnInit} from '@angular/core';
import {UntypedFormControl, Validators} from "@angular/forms";
import {NotificationService} from "../shared/notification.service";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MyLoggerService} from "../shared/my-logger.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../../environments/environment";
import {Globals} from "../globals";

@Component({
  selector: 'app-resend-verification-link-view',
  templateUrl: './resend-verification-link-view.component.html',
  styleUrls: ['./resend-verification-link-view.component.css']
})
export class ResendVerificationLinkViewComponent implements OnInit {

  emailField = new UntypedFormControl('', [
    Validators.required,
    Validators.email,
    Validators.maxLength(100)
  ]);

  isLoading: boolean;

  constructor(private notificationService: NotificationService,
              private apiEndpointsService: ApiEndpointsService,
              private http: HttpClient,
              private loggerService: MyLoggerService,
              private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService
        .get('resendVerificationLink.title')
        .subscribe((translation: string) => {
          this.titleService.setTitle(translation);
          this.loggerService.log(translation);
        });
    this.isLoading = false;
  }

  resendVerificationLinkRequest(): void {
    this.isLoading = true;

    const emailToSend: string = this.emailField.value;

    const params = new HttpParams()
        .set('email', emailToSend)
        .set('frontendUrl', environment.frontendUrl)
        .set('lang', localStorage.getItem(Globals.STORAGE_LANGUAGE_KEY));

    this.http
        .post<any>(this.apiEndpointsService.getRequestVerificationLinkResend(), params)
        .subscribe({
          next: (result) => {
            this.emailField.setValue('');
            this.isLoading = false;
            this.notificationService.success('resendVerificationLink.ifExists', {email: emailToSend});
          },
          error: (error) => {
            this.isLoading = false;
            this.notificationService.error('ERROR. ', error);
          }
        });
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.emailField.valid && !this.isLoading) {
      this.resendVerificationLinkRequest();
    }
  }

}
