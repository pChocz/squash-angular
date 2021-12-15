import {PresenceForCourt} from "./presence-for-court.model";

export class CourtPay {
  public ratePerCourtPerHour: number = 70;
  public courtsPerHour: number[] = [0, 0, 0];
  public totalPay: number = 0;
  public multisportDeduct: number = 0;
  public totalPayMultisportDeducted: number = 0;
}
