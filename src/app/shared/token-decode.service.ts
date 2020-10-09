import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlayerDetailed } from './rest-api-dto/player-detailed.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TokenDecodeService {
    currentPlayer: PlayerDetailed;

    constructor(private http: HttpClient) {
        // this.http
        //     .get<PlayerDetailed>(environment.apiUrl + 'players/me')
        //     .pipe(map((result) => plainToClass(PlayerDetailed, result)))
        //     .subscribe((result) => (this.currentPlayer = result));
    }

    get = this.http
        .get<PlayerDetailed>(environment.apiUrl + 'players/me')
        .pipe(map((result) => plainToClass(PlayerDetailed, result)));
}
