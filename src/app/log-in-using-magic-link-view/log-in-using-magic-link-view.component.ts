import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MyLoggerService} from "../shared/my-logger.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {LeagueOveralStats} from "../shared/rest-api-dto/league-overal-stats.model";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {Globals} from "../globals";
import {TokenDecodeService} from "../shared/token-decode.service";

@Component({
  selector: 'app-log-in-using-magic-link-view',
  templateUrl: './log-in-using-magic-link-view.component.html',
  styleUrls: ['./log-in-using-magic-link-view.component.css']
})
export class LogInUsingMagicLinkViewComponent implements OnInit {

  durationInSeconds: number = 7;

  isLoading: boolean;
  token: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private loggerService: MyLoggerService,
              private tokenDecodeService: TokenDecodeService,
              private titleService: Title,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe((params) => (this.token = params.token));

    const params = new HttpParams()
    .set('token', this.token)

    this.http
    .post<any>(this.apiEndpointsService.getLoginWithMagicLink(), params)
    .subscribe(
        tokens => {

          console.log("TOKENS: " + tokens);

          const newBearerToken = tokens.jwtAccessToken;
          const newRefreshToken = tokens.refreshToken;
          localStorage.setItem(Globals.STORAGE_JWT_TOKEN_KEY, newBearerToken);
          localStorage.setItem(Globals.STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);
          console.log("Password with magic link successful. Tokens have also been set properly");

          this.tokenDecodeService.refresh();

          this.isLoading = false;

          this.router.navigate([`/dashboard`]);

          this.translateService
          .get('loginUsingMagicLink.successLogin')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-primary'],
            });
          });
        },
        (error) => {
          this.isLoading = false;
          this.router.navigate([`/login`]);
          this.translateService
          .get('loginUsingMagicLink.failedLogin')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-warn'],
            });
          });
        }
    )

  }

}
