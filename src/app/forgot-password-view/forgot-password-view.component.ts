import {Component, HostListener, OnInit} from '@angular/core';
import {UntypedFormControl, Validators} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";
import {MyLoggerService} from "../shared/my-logger.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-forgot-password-view',
    templateUrl: './forgot-password-view.component.html',
    styleUrls: ['./forgot-password-view.component.css'],
})
export class ForgotPasswordViewComponent implements OnInit {

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

        const params = new HttpParams()
            .set('usernameOrEmail', emailToSend)
            .set('frontendUrl', environment.frontendUrl)
            .set('lang', localStorage.getItem(Globals.STORAGE_LANGUAGE_KEY));

        this.http
            .post<any>(this.apiEndpointsService.getRequestPasswordReset(), params)
            .subscribe({
                next: () => {
                    this.emailField.setValue('');
                    this.notificationService.success('forgotPassword.ifExists', {email: emailToSend})
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
    }

    @HostListener('document:keydown', ['$event'])
    handleDeleteKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && this.emailField.valid && !this.isLoading) {
            this.resetPassword();
        }
    }

}
