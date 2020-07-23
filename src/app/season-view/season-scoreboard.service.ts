import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Season } from './model/season.model';

@Injectable({
    providedIn: 'root'
})
export class SeasonScoreboardService {

    private baseUrl = "http://localhost:8080/scoreboards/seasons/3";

    constructor(private http: HttpClient) { }

    // list(): Observable<Season> {
    //     const url = `${this.baseUrl}/`;
    //     return this.http.get(url).pipe(
    //       // Adapt each item in the raw data array
    //       map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    //     );
    //   }

}