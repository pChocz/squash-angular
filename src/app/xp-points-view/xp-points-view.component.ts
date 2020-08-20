import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { XpPointsPerRound } from '../shared/xp-points-per-round.model';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-xp-points-view',
  templateUrl: './xp-points-view.component.html',
  styleUrls: ['./xp-points-view.component.css']
})
export class XpPointsViewComponent implements OnInit {

  displayedStaticColumns: string[] = [
    'split',
    'numberOfPlayers'
  ];

  displayedNumericPerPlaceColumns: string[] = [];

  displayedAllColumns: string[] = [];


  xpPointsPerRound: XpPointsPerRound[];


  constructor(private http: HttpClient,
    private titleService: Title) {

    this.titleService.setTitle("XP points");

    this.http.get<XpPointsPerRound[]>(environment.apiUrl + 'xpPoints/all-for-table')
      .pipe(
        map(result => plainToClass(XpPointsPerRound, result)))
      .subscribe(result => {
        console.log(result);
        this.xpPointsPerRound = result
        let maxNumberOfPlayers: number = this.xpPointsPerRound[this.xpPointsPerRound.length - 1].numberOfPlayers;
        console.log(maxNumberOfPlayers);

        for (let i = 1; i <= maxNumberOfPlayers; i++) {
          this.displayedNumericPerPlaceColumns.push(i.toString());
        }

        this.displayedAllColumns = this.displayedAllColumns.concat(this.displayedStaticColumns);
        this.displayedAllColumns = this.displayedAllColumns.concat(this.displayedNumericPerPlaceColumns);

        console.log(this.displayedAllColumns);
      });

  }

  ngOnInit(): void {
  }

}
