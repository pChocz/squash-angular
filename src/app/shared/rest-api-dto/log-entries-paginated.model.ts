import {Type} from 'class-transformer';
import {LogEntry} from "./log-entry.model";

export class LogEntriesPaginated {
    public timeTook: number;
    public size: number;
    public total: number;
    public page: number;
    public pages: number;

    @Type(() => LogEntry)
    public logEntries: LogEntry[];
}
