import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlayerDetailed} from './rest-api-dto/player-detailed.model';
import {map} from 'rxjs/operators';
import {plainToInstance} from 'class-transformer';
import {Season} from './rest-api-dto/season.model';
import {ApiEndpointsService} from "./api-endpoints.service";
import {Globals} from "../globals";
import {Router} from "@angular/router";
import {RouteEventsService} from "./route-events.service";
import {firstValueFrom} from "rxjs";
import {NotificationService} from "./notification.service";
import {MyLoggerService} from "./my-logger.service";

@Injectable()
export class AuthService {

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private loggerService: MyLoggerService,
                private router: Router,
                private route: RouteEventsService,
                private notificationService: NotificationService) {
    }

    public hasJwtToken(): boolean {
        let token = localStorage.getItem(Globals.STORAGE_JWT_TOKEN_KEY);
        if (token) {
            return true;
        } else {
            this.notificationService.error('login.signInFirst');
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

        let jsonToken = JSON.parse(window.atob(token.split('.')[1]));
        let expiryDate: Date = new Date(jsonToken.exp * 1000);

        return new Date().valueOf() < expiryDate.valueOf();
    }

    public refreshTokenPromise(currentRefreshToken: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            firstValueFrom(this.http
                .get<any>(this.apiEndpointsService.getRefreshToken(currentRefreshToken)))
                .then(
                    tokens => {
                        if (tokens) {
                            this.loggerService.log("Tokens have been silently refreshed", false);
                            const newBearerToken = tokens.jwtAccessToken;
                            const newRefreshToken = tokens.refreshToken;
                            localStorage.setItem(Globals.STORAGE_JWT_TOKEN_KEY, newBearerToken);
                            localStorage.setItem(Globals.STORAGE_REFRESH_TOKEN_KEY, newRefreshToken);
                            resolve(true);
                        } else {
                            this.loggerService.log("Tokens refresh FAIL", false);
                            resolve(false);
                        }
                    },
                    err => {
                        this.loggerService.log('Tokens refresh ERROR', false);
                        localStorage.removeItem(Globals.STORAGE_JWT_TOKEN_KEY);
                        localStorage.removeItem(Globals.STORAGE_REFRESH_TOKEN_KEY);
                        reject(err);
                    }
                )
        });
    }

    public async isUser(): Promise<boolean> {
        return firstValueFrom(this.http
            .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
            .pipe(
                map((result) => {
                    let player = plainToInstance(PlayerDetailed, result);
                    return player.isUser();
                })
            ));
    }

    public async isAdmin(): Promise<boolean> {
        return firstValueFrom(this.http
            .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
            .pipe(
                map((result) => {
                    let player = plainToInstance(PlayerDetailed, result);
                    if (!player.isAdmin()) {
                        let previousPath = this.route.previousRoutePath.getValue();
                        if (previousPath.startsWith("/login")) {
                            this.router.navigate([`/dashboard`]);
                        }
                        this.notificationService.error('adminPanel.notAdmin');
                    }
                    return player.isAdmin();
                })
            ));
    }

    public async isOwnerOrModeratorOfLeague(leagueUuid: string): Promise<boolean> {
        return this.hasAnyOfRolesForLeague(leagueUuid, 'MODERATOR', 'OWNER');
    }

    public async isPlayerOfLeague(leagueUuid: string): Promise<boolean> {
        return this.hasRoleForLeague(leagueUuid, 'PLAYER');
    }

    public async hasAnyOfRolesForLeague(leagueUuid: string, ...roles: string[]): Promise<boolean> {
        return firstValueFrom(this.http
            .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
            .pipe(
                map((result) => {
                    let player = plainToInstance(PlayerDetailed, result);
                    let hasRole = player.hasAnyOfRolesForLeague(leagueUuid, roles) || player.isAdmin();
                    if (!hasRole) {
                        this.showErrorAndRedirect(roles[0]);
                    }
                    return hasRole;
                })
            ));
    }

    public async hasRoleForLeague(leagueUuid: string, role: string, showError: boolean = true): Promise<boolean> {
        return firstValueFrom(this.http
            .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
            .pipe(
                map((result) => {
                    let player = plainToInstance(PlayerDetailed, result);
                    let hasRole = player.hasRoleForLeague(leagueUuid, role) || player.isAdmin();
                    if (!hasRole && showError) {
                        this.showErrorAndRedirect(role);
                    }
                    return hasRole;
                })
            ));
    }

    public async hasRoleForLeagueForSeason(seasonUuid: string, role: string, showError: boolean = true): Promise<boolean> {
        const season = await firstValueFrom(this.http
            .get<Season>(this.apiEndpointsService.getSeasonByUuid(seasonUuid))
            .pipe(map((result) => plainToInstance(Season, result)))
        );

        const player = await firstValueFrom(this.http
            .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
            .pipe(map((result) => plainToInstance(PlayerDetailed, result)))
        );

        const hasRole = player.hasRoleForLeague(season.leagueUuid, role) || player.isAdmin();
        if (!hasRole && showError) {
            this.showErrorAndRedirect(role);
        }

        return hasRole;
    }

    public async hasRoleForLeagueForRound(roundUuid: string, role: string, showError: boolean = true): Promise<boolean> {
        const leagueUuid = await firstValueFrom(this.http
            .get<string>(this.apiEndpointsService.getLeagueUuidByRoundUuid(roundUuid))
            .pipe(map((result) => plainToInstance(String, result)))
        );

        const player = await firstValueFrom(this.http
            .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
            .pipe(map((result) => plainToInstance(PlayerDetailed, result)))
        );

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
        this.notificationService.error(role === 'PLAYER' ? 'league.notPlayer' : 'league.notModerator');
    }

}
