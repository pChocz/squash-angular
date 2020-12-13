import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {TokenDecodeService} from "../shared/token-decode.service";

@Component({
    selector: 'app-logout-view',
    templateUrl: './logout-view.component.html',
    styleUrls: ['./logout-view.component.css']
})
export class LogoutViewComponent implements OnInit {

    durationInSeconds = 7;
    messageLogout: string = "You have been succesfully logged out.";
    loadingMessage: string = "Logging out";

    constructor(private tokenDecodeService: TokenDecodeService,
                private http: HttpClient,
                private router: Router,
                private snackBar: MatSnackBar) {

    }

    ngOnInit(): void {
        let params = new HttpParams().set("token", localStorage.getItem("token"));

        this.http.post<any>(environment.apiUrl + 'players/logout', params)
            .subscribe(
                () => {

                    // clearing the token from local storage
                    localStorage.removeItem("token");

                    this.snackBar.open(this.messageLogout, "X", {
                        duration: this.durationInSeconds * 1000,
                        panelClass: ['mat-toolbar', 'mat-primary']
                    });

                    this.tokenDecodeService.refresh();

                    this.router.navigate([`/login`]);
                }
            );
    }

}
