import {Type} from "class-transformer";

export class LogEntry {
  public id: string;

  @Type(() => Date)
  public timestamp: Date;

  public username: string;
  public className: string;
  public methodName: string;
  public requestMapping: string;
  public arguments: string;

  public duration: number;
  public queryCount: number;
  public isException: boolean;
  public message: string;
  public type: string;
}