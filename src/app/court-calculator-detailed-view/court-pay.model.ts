export class CourtPay {
  public ratePerCourtPerHour: number;
  public courtsPerHour: number[];
  public totalPay: number;
  public multisportDeduct: number;
  public totalPayMultisportDeducted: number;
  public socialismMode: boolean;

  constructor() {
    this.ratePerCourtPerHour = 70;
    this.courtsPerHour = [0, 0, 0];
    this.totalPay = 0;
    this.multisportDeduct = 0;
    this.totalPayMultisportDeducted = 0;
    this.socialismMode = false;
  }
}
