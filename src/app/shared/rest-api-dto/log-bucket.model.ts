import {Type} from "class-transformer";

export class LogBucket {

  @Type(() => Date)
  public id: Date;

  public countSum: number;
}