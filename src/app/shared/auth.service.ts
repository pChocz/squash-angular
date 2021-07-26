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

@Injectable()
export class AuthService {

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService,
              private snackBar: MatSnackBar,
              private translateService: TranslateService) {
  }

  public hasAnyToken(): boolean {
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
          return player.isAdmin();
        })
    )
    .toPromise();
  }

  public async hasRoleForLeague(leagueUuid: string, role: string): Promise<boolean> {
    return this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
    .pipe(
        map((result) => {
          let player = plainToClass(PlayerDetailed, result);
          return player.hasRoleForLeague(leagueUuid, role) || player.isAdmin();
        })
    )
    .toPromise();
  }

  public async hasRoleForLeagueForSeason(seasonUuid: string, role: string): Promise<boolean> {
    const season = await this.http
    .get<Season>(this.apiEndpointsService.getSeasonByUuid(seasonUuid))
    .pipe(map((result) => plainToClass(Season, result)))
    .toPromise();

    const player = await this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
    .pipe(map((result) => plainToClass(PlayerDetailed, result)))
    .toPromise();

    return player.hasRoleForLeague(season.leagueUuid, role) || player.isAdmin();
  }

  public async hasRoleForLeagueForRound(roundUuid: string, role: string): Promise<boolean> {
    const leagueUuid = await this.http
    .get<string>(this.apiEndpointsService.getLeagueUuidByRoundUuid(roundUuid))
    .pipe(map((result) => plainToClass(String, result)))
    .toPromise();

    const player = await this.http
    .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
    .pipe(map((result) => plainToClass(PlayerDetailed, result)))
    .toPromise();

    return player.hasRoleForLeague(leagueUuid, role) || player.isAdmin();
  }

}
