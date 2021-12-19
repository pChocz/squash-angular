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
    this.route.params.subscribe(params => this.token = params['token']);
    let params = new HttpParams().set('token', this.token);

    this.http
    .post(this.apiEndpointsService.getConfirmEmailChange(), params)
    .subscribe(
        () => {
          console.log("Email changed successfully");

          this.router.navigate([`/logout`]);

          this.translateService
          .get('myAccount.emailChangedProperly')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, "X", {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-primary']
            });
          });
        },
        (error) => {
          console.log("Email change ERROR");

          this.router.navigate([`/my-account`]);

          this.translateService
          .get('myAccount.emailChangeError')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, "X", {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          });
        }
    )
  }

}
