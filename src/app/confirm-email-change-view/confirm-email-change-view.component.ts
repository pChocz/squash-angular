import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-confirm-email-change-view',
  templateUrl: './confirm-email-change-view.component.html',
  styleUrls: ['./confirm-email-change-view.component.css']
})
export class ConfirmEmailChangeViewComponent implements OnInit {

  token: string;
  durationInSeconds: number = 7;
  messageCode: string;

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              // private loggerService: MyLoggerService,
              private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              // private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.messageCode = 'processing'
    this.route.params.subscribe(params => this.token = params['token']);
    let params = new HttpParams().set('token', this.token);

    this.http
    .post(this.apiEndpointsService.getConfirmEmailChange(), params)
    .subscribe(
        () => {
          console.log("Email changed successfully");
          this.messageCode = 'myAccount.emailChangedProperly';

        },
        (error) => {
          console.log("Email change ERROR");
          this.messageCode = 'myAccount.emailChangeError';
        }
    )
  }

}