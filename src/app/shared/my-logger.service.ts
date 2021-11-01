import {Injectable} from "@angular/core";
import {NGXLogger} from "ngx-logger";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiEndpointsService} from "./api-endpoints.service";

@Injectable()
export class MyLoggerService {

  constructor(private ngxLogger: NGXLogger,
              private apiEndpointsService: ApiEndpointsService,
              private http: HttpClient) {
  }

  log(message: string, logToServer: boolean = true) {

    this.ngxLogger.log(message);

    if (logToServer) {
      let params = new HttpParams().set('message', message);

      this.http
      .post(this.apiEndpointsService.getLog(), params)
      .subscribe( () => {
        // do nothing
      })
    }
  }
}
