import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlayerDetailed } from './player-detailed.model';
import { environment } from 'src/environments/environment';
import { map, } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {

  durationInSeconds = 7;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar) {

  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return true;
  }

  public async isAdmin(): Promise<boolean> {
    const player = await this.http.get<PlayerDetailed>(environment.apiUrl + 'players/me')
      .pipe(
        map(result => plainToClass(PlayerDetailed, result)))
      .toPromise();
    console.log(player);
    return player.isAdmin();
  }
  
  public async hasRoleForLeague(leagueUuid: string, role: string): Promise<boolean> {
    const player = await this.http.get<PlayerDetailed>(environment.apiUrl + 'players/me')
      .pipe(
        map(result => plainToClass(PlayerDetailed, result)))
      .toPromise();
    return player.hasRoleForLeague(leagueUuid, role) || player.isAdmin();
  }

}
