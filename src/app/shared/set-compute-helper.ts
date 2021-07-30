import {Injectable} from '@angular/core';
import {Router, RoutesRecognized} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {filter, pairwise} from 'rxjs/operators';
import {Location} from '@angular/common';

@Injectable()
export abstract class SetComputeHelper {

  public static computeExampleSetResults(type: string, points: number): string {
    if (type === 'ADV_OF_2_ABSOLUTE') {
      return (points) + ':0' + ', '
          + (points) + ':' + (points - 2) + ', '
          + (points + 1) + ':' + (points - 1) + ', '
          + (points + 3) + ":" + (points + 1);

    } else if (type === 'WINNING_POINTS_ABSOLUTE') {
      return (points) + ':0' + ', '
          + (points) + ':' + (points - 4) + ', '
          + (points) + ':' + (points - 2) + ', '
          + (points) + ":" + (points - 1);

    } else if (type === 'ADV_OF_2_OR_1_AT_THE_END') {
      return (points) + ':0' + ', '
          + (points) + ':' + (points - 2) + ', '
          + (points + 1) + ':' + (points - 1) + ', '
          + (points + 1) + ":" + (points);

    } else {
      return '';
    }
  }

}
