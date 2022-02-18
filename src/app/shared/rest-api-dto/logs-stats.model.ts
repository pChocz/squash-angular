import {Type} from "class-transformer";

export class LogsStats {
  public timeTook: number;

  public count: number;

  public usernames: string[];
  public logTypes: string[];
  public classNames: string[];

  @Type(() => Date)
  public minDateTime: Date;

  @Type(() => Date)
  public maxDateTime: Date;

  public minDuration: number;
  public maxDuration: number;
  public minQueryCount: number;
  public maxQueryCount: number;
}
