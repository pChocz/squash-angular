import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {AuthService} from '../auth.service';

@Injectable()
export class AuthGuardUser implements CanActivate {

    constructor(private auth: AuthService) {

    }

    canActivate(): Promise<boolean> {
        return this.auth.hasAnyToken() && this.auth.isUser();
    }

}
