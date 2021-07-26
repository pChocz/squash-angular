import {Player} from 'src/app/shared/rest-api-dto/player.model';
import {Type} from 'class-transformer';

export class HeadToHeadScoreboardRow {

  @Type(() => Player)
  public player: Player;

  public pointsWon: number;
  public pointsLost: number;
  public pointsRatio: number;

  public setsWon: number;
  public setsLost: number;
  public setsRatio: number;

  public matchesWon: number;
  public matchesLost: number;
  public matchesRatio: number;

  // Sets

  public firstSetsWon: number;
  public firstSetsLost: number;
  public firstSetsRatio: number;

  public secondSetsWon: number;
  public secondSetsLost: number;
  public secondSetsRatio: number;

  public thirdSetsWon: number;
  public thirdSetsLost: number;
  public thirdSetsRatio: number;

  public fourthSetsWon: number;
  public fourthSetsLost: number;
  public fourthSetsRatio: number;

  public fifthSetsWon: number;
  public fifthSetsLost: number;
  public fifthSetsRatio: number;

  // Matches

  public oneSetMatchesWon: number;
  public oneSetMatchesLost: number;
  public oneSetMatchesRatio: number;

  public twoSetsMatchesWon: number;
  public twoSetsMatchesLost: number;
  public twoSetsMatchesRatio: number;

  public threeSetsMatchesWon: number;
  public threeSetsMatchesLost: number;
  public threeSetsMatchesRatio: number;

  public fourSetsMatchesWon: number;
  public fourSetsMatchesLost: number;
  public fourSetsMatchesRatio: number;

  public fiveSetsMatchesWon: number;
  public fiveSetsMatchesLost: number;
  public fiveSetsMatchesRatio: number;

}
