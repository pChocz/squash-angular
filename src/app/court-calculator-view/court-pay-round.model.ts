export class CourtPayRound {

  // predefined changeable values
  ratePerHour: number = 60;
  playersPerGroup: number[] = [5, 5, 0, 0];
  courtsPerHour: number[] = [4, 4, 0];
  addToRound: number = 10;
  playersMultisport: number[] = [0, 0, 0, 0];

  // results
  allPlayers: number;
  allMatches: number;
  minutesPerMatch: number;
  totalCost: number;
  totalMultisportReduce: number;
  totalToPayCash: number;
  costPerPlayerFixed: number;
  costPerPlayerReal: number[] = [0, 0, 0, 0, 0];

}
