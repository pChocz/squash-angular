import { SeasonScoreboardRow } from './season-scoreboard-row.model';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/adapter';

export class Season {

  constructor(
    public seasonId: number,
    public seasonNumber: number,
    public seasonStartDate: Date,
    public seasonScoreboardRows: SeasonScoreboardRow[],
    public finishedRounds: number,
    public countedRounds: number) { }

}

@Injectable({
  providedIn: "root",
})
export class CourseAdapter implements Adapter<Season> {

  adapt(item: any): Season {
    return new Season(
      item.seasonId,
      item.seasonNumber,
      item.seasonStartDate,
      item.seasonScoreboardRows,
      item.finishedRounds,
      item.countedRounds,
    );
  }

}
