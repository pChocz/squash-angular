import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Title} from '@angular/platform-browser';
import {HttpBackend, HttpClient, HttpParams} from '@angular/common/http';
import {TokenDecodeService} from "../shared/token-decode.service";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.css'],
})
export class LoginViewComponent implements OnInit {

  durationInSeconds = 7;

  hide: boolean;
  isLoading: boolean;
  username = '';
  password = '';

  returnUrl: string;

  constructor(private tokenDecodeService: TokenDecodeService,
              private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private handler: HttpBackend,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private titleService: Title,
              private translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.translateService
    .get('login.title')
    .subscribe((translation: string) => {
      this.titleService.setTitle(translation);
    });
    this.http = new HttpClient(this.handler);
    this.hide = true;
    this.isLoading = false;

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  isEmptyInput(): boolean {
    return this.username.length === 0 || this.password.length === 0;
  }

  login(): void {
    this.isLoading = true;

    const params = new HttpParams()
    .set('usernameOrEmail', this.username)
    .set('password', this.password);

    this.http
    .post<any>(this.apiEndpointsService.getLogin(), params, {
      observe: 'response' as 'body',
    })
    .subscribe(
        (result) => {
          const newBearerToken: string = result.headers.get(Globals.JWT_TOKEN_HEADER);
          const newRefreshToken: string = result.headers.get(Globals.REFRESH_TOKEN_HEADER);

          localStorage.setItem(Globals.STORAGE_JWT_TOKEN_KEY, newBearerToken);
          localStorage.setItem(Globals.STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);

          this.translateService
          .get('login.successfull')
          .subscribe((translation: string) => {
            this.snackBar.open(translation, 'X', {
              duration: this.durationInSeconds * 1000,
              panelClass: ['mat-toolbar', 'mat-primary'],
            });
          });

          this.tokenDecodeService.refresh();
          this.router.navigateByUrl(this.returnUrl);
        },

        (error) => {
          this.isLoading = false;
          this.password = '';

          console.log(error);

          if (error.status === 0) {
            this.translateService
            .get('error.databaseConnectionError')
            .subscribe((translation: string) => {
              this.snackBar.open(translation, 'X', {
                duration: this.durationInSeconds * 1000,
                panelClass: ['mat-toolbar', 'mat-error'],
              });
            });

          } else if (error.status === 401) {
            this.translateService
            .get('error.incorrectUsernameOrPassword')
            .subscribe((translation: string) => {
              this.snackBar.open(translation, 'X', {
                duration: this.durationInSeconds * 1000,
                panelClass: ['mat-toolbar', 'mat-warn'],
              });
            });

          }
          this.tokenDecodeService.refresh();
        }
    );
  }

  @HostListener('document:keydown', ['$event'])
  handleDeleteKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && !this.isEmptyInput()) {
      this.login();
    }
  }

}
