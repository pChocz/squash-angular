import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlayerDetailed} from './rest-api-dto/player-detailed.model';
import {map} from 'rxjs/operators';
import {plainToInstance} from 'class-transformer';
import {ApiEndpointsService} from "./api-endpoints.service";
import {Globals} from "../globals";
import {MyLoggerService} from "./my-logger.service";

@Injectable()
export class TokenDecodeService {

    token;
    expiryDate: Date;
    currentPlayer: PlayerDetailed;

    constructor(private http: HttpClient,
                private loggerService: MyLoggerService,
                private apiEndpointsService: ApiEndpointsService) {
        this.refresh();
    }

    public refresh() {
        let tokenString = localStorage.getItem(Globals.STORAGE_JWT_TOKEN_KEY);
        if (tokenString) {
            this.token = JSON.parse(window.atob(tokenString.split('.')[1]));
            this.expiryDate = new Date(this.token.exp * 1000);

            this.http
                .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
                .pipe(map((result) => plainToInstance(PlayerDetailed, result)))
                .subscribe({
                    next: (result) => {
                        this.currentPlayer = result;

                    },
                    error: (error) => {
                        this.loggerService.log("CANNOT EXTEND TOKEN: " + error, false);
                        this.token = null;
                        this.currentPlayer = null;
                        this.expiryDate = null;
                    }
                });

        } else {
            this.token = null;
            this.currentPlayer = null;
            this.expiryDate = null;
        }
    }

}
