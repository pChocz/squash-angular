import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {LogEntriesPaginated} from "../../shared/rest-api-dto/log-entries-paginated.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {LogEntry} from "../../shared/rest-api-dto/log-entry.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {map, startWith, switchMap} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {merge} from "rxjs";

@Component({
  selector: 'app-logs-table',
  templateUrl: './logs-table.component.html',
  styleUrls: ['./logs-table.component.css']
})
export class LogsTableComponent implements AfterViewInit, OnChanges {

  displayedColumns: string[] = [
    'timestamp-column',
    'message-column'
  ];



  dataSource: MatTableDataSource<LogEntry>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() params: HttpParams;
  logEntriesPaginated: LogEntriesPaginated;

  constructor(private http: HttpClient,
              private apiEndpointsService: ApiEndpointsService) {

  }

  ngAfterViewInit(): void {
    merge(this.paginator.page)
        .pipe(
            startWith({}),
            switchMap(() => {
              this.params = this.params.set('page', String(this.paginator.pageIndex));
              return this.http
                  .get<LogEntriesPaginated>(this.apiEndpointsService.getLogsPaginated(), {
                    params: this.params
                  })
            }),
            map((result) => {
              this.paginator.pageSizeOptions = [result.pages];
              return plainToInstance(LogEntriesPaginated, result);
            })
        )
        .subscribe((result) => {
          this.logEntriesPaginated = result;
          this.dataSource = new MatTableDataSource<LogEntry>(this.logEntriesPaginated.logEntries);
        });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['params'].isFirstChange()) {
        this.paginator.pageIndex = 0;
        this.ngAfterViewInit();
    }
  }

}
