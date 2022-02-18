import {Type} from "class-transformer";
import {LogBucket} from "./log-bucket.model";
import {LogAggregateByUser} from "./log-aggregate-by-user.model";
import {LogAggregateByMethod} from "./log-aggregate-by-method.model";
import {LogsStats} from "./logs-stats.model";

export class LogSummary {

  @Type(() => LogsStats)
  public allLogsStats: LogsStats;

  @Type(() => LogsStats)
  public filteredLogsStats: LogsStats;

  @Type(() => LogAggregateByMethod)
  public filteredLogsAggregateByMethod: LogAggregateByMethod[];

  @Type(() => LogAggregateByUser)
  public filteredLogsAggregateByUser: LogAggregateByUser[];

  @Type(() => LogBucket)
  public logBuckets: LogBucket[];

  public timeTookMillis: number;
}
