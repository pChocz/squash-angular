import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Match } from './match.model';
import { Type, plainToClass, deserializeArray } from "class-transformer";
import { M } from '@angular/cdk/keycodes';

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    matches: Match[];

    constructor(@Inject(String) private matchesJson: string) {
        this.matches = deserializeArray(Match, matchesJson)
    }

}