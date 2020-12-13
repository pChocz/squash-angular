import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlayerDetailed} from './rest-api-dto/player-detailed.model';
import {environment} from 'src/environments/environment';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';

@Injectable()
export class TokenDecodeService {

    token;
    expiryDate: Date;
    currentPlayer: PlayerDetailed;

    constructor(private http: HttpClient) {
        this.refresh();
    }

    public refresh() {
        let tokenString = localStorage.getItem('token');
        if (tokenString) {
            this.token = JSON.parse(atob(tokenString.split('.')[1]));
            this.expiryDate = new Date(this.token.exp * 1000);

            this.http
                .get<PlayerDetailed>(environment.apiUrl + 'players/me')
                .pipe(map((result) => plainToClass(PlayerDetailed, result)))
                .subscribe((result) => (this.currentPlayer = result));

        } else {
            this.token = null;
            this.currentPlayer = null;
            this.expiryDate = null;
        }
    }

}
