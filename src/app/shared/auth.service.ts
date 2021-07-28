import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlayerDetailed} from './rest-api-dto/player-detailed.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {Season} from './rest-api-dto/season.model';
import {MatSnackBar} from "@angular/material/snack-bar";
import {ApiEndpointsService} from "./api-endpoints.service";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../globals";
import {Router} from "@angular/router";
import {RouteEventsService} from "./route-events.service";

@Injectable()
export class AuthService {

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private router: Router,
              private route: RouteEventsService,
              private snackBar: MatSnackBar,
              private translateService: TranslateService) {
  }

  public hasJwtToken(): boolean {
    let token = localStorage.getItem(Globals.STORAGE_JWT_TOKEN_KEY);
    if (token) {
      return true;
    } else {
      this.translateService
      .get('login.signInFirst')
      .subscribe((translation: string) => {
        this.snackBar.open(translation, 'X', {
          duration: 7 * 1000,
          panelClass: ['mat-toolbar', 'mat-warn'],
        });
      });
      return false;
    }
  }

  public hasRefreshToken(): boolean {
    let token = localStorage.getItem(Globals.STORAGE_REFRESH_TOKEN_KEY);
    return token !== null;
  }

  public hasValidToken(): boolean {
    let token: string = localStorage.getItem(Globals.STORAGE_JWT_TOKEN_KEY);
    if (!token) {
      return false;
    }

    let jsonToken = JSON.parse(atob(token.split('.')[1]));
    let expiryDate: Date = new Date(jsonToken.exp * 1000);

    return new Date().valueOf() < expiryDate.valueOf();
  }

  public refreshTokenPromise(currentRefreshToken: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.http
      .get<any>(this.apiEndpointsService.getRefreshToken(currentRefreshToken))
      .toPromise()
      .then(
          tokens => {
            if (tokens) {
              console.log("Tokens have been silently refreshed");
              const newBearerToken = tokens.jwtAccessToken;
              const newRefreshToken = tokens.refreshToken;
              localStorage.setItem(Globals.STORAGE_JWT_TOKEN_KEY, newBearerToken);
              localStorage.setItem(Globals.STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);
              resolve(true);
            } else {
              console.log("Tokens refresh FAIL");
              this.router.navigate([`/login`], {queryParams: {returnUrl: this.route.previousRoutePath.getValue()}});
              resolve(false);
            }
          },
          err => {
            console.log('Tokens refresh ERROR');
            this.router.navigate([`/login`], {queryParams: {returnUrl: this.route.previousRoutePath.getValue()}});
            localStorage.removeItem(Globals.STORAGE_JWT_TOKEN_KEY);
            localStorage.removeItem(Globals.STORAGE_REFRESH_TOKEN_KEY);
            reject(err);
          }
      )
    });
  }

  public async isUser(): Promise<boolean> {
    return this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
    .pipe(
        map((result) => {
          let player = plainToClass(PlayerDetailed, result);
          return player.isUser();
        })
    )
    .toPromise();
  }

  public async isAdmin(): Promise<boolean> {
    return await this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
    .pipe(
        map((result) => {
          let player = plainToClass(PlayerDetailed, result);
          if (!player.isAdmin()) {
            let previousPath = this.route.previousRoutePath.getValue();
            if (previousPath.startsWith("/login")) {
              this.router.navigate([`/dashboard`]);
            }
            this.translateService
            .get('adminPanel.notAdmin')
            .subscribe((translation: string) => {
              this.snackBar.open(translation, 'X', {
                duration: 7 * 1000,
                panelClass: ['mat-toolbar', 'mat-warn'],
              });
            });
          }
          return player.isAdmin();
        })
    )
    .toPromise();
  }

  public async isModeratorOfLeague(leagueUuid: string): Promise<boolean> {
    return this.hasRoleForLeague(leagueUuid, 'MODERATOR');
  }

  public async isPlayerOfLeague(leagueUuid: string): Promise<boolean> {
    return this.hasRoleForLeague(leagueUuid, 'PLAYER');
  }

  public async hasRoleForLeague(leagueUuid: string, role: string, showError: boolean = true): Promise<boolean> {
    return this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
    .pipe(
        map((result) => {
          let player = plainToClass(PlayerDetailed, result);
          let hasRole = player.hasRoleForLeague(leagueUuid, role) || player.isAdmin();
          if (!hasRole && showError) {
            this.showErrorAndRedirect(role);
          }
          return hasRole;
        })
    )
    .toPromise();
  }

  public async hasRoleForLeagueForSeason(seasonUuid: string, role: string, showError: boolean = true): Promise<boolean> {
    const season = await this.http
    .get<Season>(this.apiEndpointsService.getSeasonByUuid(seasonUuid))
    .pipe(map((result) => plainToClass(Season, result)))
    .toPromise();

    const player = await this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
    .pipe(map((result) => plainToClass(PlayerDetailed, result)))
    .toPromise();

    const hasRole = player.hasRoleForLeague(season.leagueUuid, role) || player.isAdmin();
    if (!hasRole && showError) {
      this.showErrorAndRedirect(role);
    }

    return hasRole;
  }

  public async hasRoleForLeagueForRound(roundUuid: string, role: string, showError: boolean = true): Promise<boolean> {
    const leagueUuid = await this.http
    .get<string>(this.apiEndpointsService.getLeagueUuidByRoundUuid(roundUuid))
    .pipe(map((result) => plainToClass(String, result)))
    .toPromise();

    const player = await this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
    .pipe(map((result) => plainToClass(PlayerDetailed, result)))
    .toPromise();

    const hasRole = player.hasRoleForLeague(leagueUuid, role) || player.isAdmin();
    if (!hasRole && showError) {
      this.showErrorAndRedirect(role);
    }

    return hasRole;
  }

  private showErrorAndRedirect(role: string) {
    let previousPath = this.route.previousRoutePath.getValue();
    if (previousPath.startsWith("/login")) {
      this.router.navigate([`/dashboard`]);
    }
    console.log(role);
    this.translateService
    .get(role === 'PLAYER' ? 'league.notPlayer' : 'league.notModerator')
    .subscribe((translation: string) => {
      this.snackBar.open(translation, 'X', {
        duration: 7 * 1000,
        panelClass: ['mat-toolbar', 'mat-warn'],
      });
    });
  }
}
