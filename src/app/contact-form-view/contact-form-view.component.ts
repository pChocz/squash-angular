import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MyLoggerService} from "../shared/my-logger.service";

@Component({
  selector: 'app-contact-form-view',
  templateUrl: './contact-form-view.component.html',
  styleUrls: ['./contact-form-view.component.css']
})
export class ContactFormViewComponent implements OnInit {

  messageSent: boolean;
  messageSending: boolean;

  nameField = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(30),
  ]);

  emailField = new FormControl('', [
    Validators.maxLength(100),
    Validators.required,
    Validators.email,
  ]);

  subjectField = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100)
  ]);

  messageField = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(1000)
  ]);

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
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
    console.log("sending message");

    this.messageSending = true;

    let params = new HttpParams()
    .set('name', this.nameField.value)
    .set('email', this.emailField.value)
    .set('subject', this.subjectField.value)
    .set('message', this.messageField.value);

    this.http
    .post<any>(this.apiEndpointsService.getSubmitContactForm(), params)
    .subscribe(
        () => {
          console.log("email sent properly");
          this.messageSent = true;
          this.messageSending = false;

        },
        () => {
          console.log("email send error!");
          this.messageSent = true;
          this.messageSending = false;

        }
    );
  }

}
