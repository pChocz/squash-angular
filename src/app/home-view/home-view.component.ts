import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { PlayerDetailed } from '../shared/rest-api-dto/player-detailed.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-home-view',
    templateUrl: './home-view.component.html',
    styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent implements OnInit {
    durationInSeconds = 7;

    currentPlayerUuid: string;
    currentPlayer: PlayerDetailed;

    constructor(
        private router: Router,
        private http: HttpClient,
        private titleService: Title,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.titleService.setTitle('Home');

        const token: string = localStorage.getItem('token');

        if (token === null) {
            this.router.navigate([`/login`]);
            this.snackBar.open('You must sign in first!', 'X', {
                duration: this.durationInSeconds * 1000,
                panelClass: ['mat-toolbar', 'mat-primary'],
            });
        } else {
            const decodedToken: string = atob(token.split('.')[1]);
            const tokenObject = JSON.parse(decodedToken);
            this.currentPlayerUuid = tokenObject.uid;

            this.http
                .get<PlayerDetailed>(environment.apiUrl + 'players/me')
                .pipe(map((result) => plainToClass(PlayerDetailed, result)))
                .subscribe((result) => (this.currentPlayer = result));
        }
    }
}
