import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";

@Component({
  selector: 'app-confirm-registration-view',
  templateUrl: './confirm-registration-view.component.html',
  styleUrls: ['./confirm-registration-view.component.css']
})
export class ConfirmRegistrationViewComponent implements OnInit {

  status: string;
  token: string;
  validating: boolean;

  constructor(
      private http: HttpClient,
      private apiEndpointsService: ApiEndpointsService,
      private route: ActivatedRoute,
      private titleService: Title,
      private translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.translateService
    .get('confirmRegistration.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
    });

    this.validating = true;
    this.route.params.subscribe(params => this.token = params[Globals.STORAGE_JWT_TOKEN_KEY]);
    let params = new HttpParams().set(Globals.STORAGE_JWT_TOKEN_KEY, this.token);

    this.http
    .post<number>(this.apiEndpointsService.getConfirmRegistration(), params)
    .subscribe(
        () => {
          this.status = "SUCCESS";
          this.validating = false;
        },
        (error) => {
          this.status = "ERROR";
          this.validating = false;
        }
    );

  }

}
