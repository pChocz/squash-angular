import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MyLoggerService} from "../shared/my-logger.service";
import {NotificationService} from "../shared/notification.service";

@Component({
    selector: 'app-contact-form-view',
    templateUrl: './contact-form-view.component.html',
    styleUrls: ['./contact-form-view.component.css']
})
export class ContactFormViewComponent implements OnInit {

    messageSent: boolean;
    messageSending: boolean;

    nameField = new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
    ]);

    emailField = new UntypedFormControl('', [
        Validators.maxLength(100),
        Validators.required,
        Validators.email,
    ]);

    subjectField = new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
    ]);

    messageField = new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000)
    ]);

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private notificationService: NotificationService,
                private loggerService: MyLoggerService,
                private titleService: Title,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.messageSent = false;
        this.messageSending = false;

        this.translateService
            .get('contactForm.title')
            .subscribe((translation: string) => {
                this.titleService.setTitle(translation);
                this.loggerService.log(translation);
            });
    }

    anyFieldIsInvalid(): boolean {
        return this.nameField.invalid
            || this.emailField.invalid
            || this.subjectField.invalid
            || this.messageField.invalid;
    }

    sendMessage(): void {
        this.messageSending = true;

        let params = new HttpParams()
            .set('name', this.nameField.value)
            .set('email', this.emailField.value)
            .set('subject', this.subjectField.value)
            .set('message', this.messageField.value);

        this.http
            .post<any>(this.apiEndpointsService.getSubmitContactForm(), params)
            .subscribe({
                next: () => {
                    this.notificationService.success('contactForm.thankYou');
                },
                complete: () => {
                    this.messageSent = true;
                    this.messageSending = false;
                }
            });
    }

}
