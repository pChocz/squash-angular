import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlayerDetailed} from './rest-api-dto/player-detailed.model';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {Season} from './rest-api-dto/season.model';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class AuthService {
    durationInSeconds = 7;

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar) {
    }

    public hasAnyToken(): boolean {
        let token = localStorage.getItem('token');
        if (token) {
            return true;
        } else {
            this.snackBar.open('You must sign in first!', 'X', {
                duration: 7 * 1000,
                panelClass: ['mat-toolbar', 'mat-warn'],
            });
            return false;
        }
    }

    public async isUser(): Promise<boolean> {
        const player = await this.http
            .get<PlayerDetailed>(environment.apiUrl + 'players/me')
            .pipe(map((result) => plainToClass(PlayerDetailed, result)))
            .toPromise();
        console.log(player);
        return player.isUser();
    }

    public async isAdmin(): Promise<boolean> {
        const player = await this.http
            .get<PlayerDetailed>(environment.apiUrl + 'players/me')
            .pipe(map((result) => plainToClass(PlayerDetailed, result)))
            .toPromise();
        console.log(player);
        return player.isAdmin();
    }

    public async hasRoleForLeague(leagueUuid: string, role: string): Promise<boolean> {
        const player = await this.http
            .get<PlayerDetailed>(environment.apiUrl + 'players/me')
            .pipe(map((result) => plainToClass(PlayerDetailed, result)))
            .toPromise();
        return player.hasRoleForLeague(leagueUuid, role) || player.isAdmin();
    }

    public async hasRoleForLeagueForSeason(seasonUuid: string, role: string): Promise<boolean> {
        const season = await this.http
            .get<Season>(environment.apiUrl + 'seasons/' + seasonUuid)
            .pipe(map((result) => plainToClass(Season, result)))
            .toPromise();

        const player = await this.http
            .get<PlayerDetailed>(environment.apiUrl + 'players/me')
            .pipe(map((result) => plainToClass(PlayerDetailed, result)))
            .toPromise();

        return player.hasRoleForLeague(season.leagueUuid, role) || player.isAdmin();
    }

    public async hasRoleForLeagueForRound(roundUuid: string, role: string): Promise<boolean> {
        const leagueUuid = await this.http
            .get<string>(environment.apiUrl + 'rounds/' + roundUuid + '/leagueUuid')
            .pipe(map((result) => plainToClass(String, result)))
            .toPromise();

        const player = await this.http
            .get<PlayerDetailed>(environment.apiUrl + 'players/me')
            .pipe(map((result) => plainToClass(PlayerDetailed, result)))
            .toPromise();

        return player.hasRoleForLeague(leagueUuid, role) || player.isAdmin();
    }
}
