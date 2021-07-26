import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlayerDetailed} from './rest-api-dto/player-detailed.model';
import {map} from 'rxjs/operators';
import {plainToClass} from 'class-transformer';
import {ApiEndpointsService} from "./api-endpoints.service";
import {Globals} from "../globals";

@Injectable()
export class TokenDecodeService {

  token;
  expiryDate: Date;
  currentPlayer: PlayerDetailed;

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService) {
    this.refresh();
  }

  public refresh() {
    let tokenString = localStorage.getItem(Globals.STORAGE_JWT_TOKEN_KEY);
    if (tokenString) {
      this.token = JSON.parse(atob(tokenString.split('.')[1]));
      this.expiryDate = new Date(this.token.exp * 1000);

      this.http
      .get<PlayerDetailed>(this.apiEndpointsService.getAboutMeInfo())
      .pipe(map((result) => plainToClass(PlayerDetailed, result)))
      .subscribe((result) => (this.currentPlayer = result));

    } else {
      this.token = null;
      this.currentPlayer = null;
      this.expiryDate = null;
    }
  }

}
