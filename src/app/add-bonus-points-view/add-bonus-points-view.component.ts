import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Player} from "../shared/rest-api-dto/player.model";
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Season} from "../shared/rest-api-dto/season.model";
import {BonusPoint} from "../shared/rest-api-dto/bonus-point.model";

@Component({
    selector: 'app-add-bonus-points-view',
    templateUrl: './add-bonus-points-view.component.html',
    styleUrls: ['./add-bonus-points-view.component.css'],
})
export class AddBonusPointsViewComponent implements OnInit {
    seasonUuid: string;
    season: Season;
    players: Player[];
    winner: Player;
    looser: Player;
    points: number;
    currentBonusPointsForSeason: BonusPoint[];

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        private router: Router,
        private titleService: Title,
        private snackBar: MatSnackBar
    ) {
        this.titleService.setTitle('Bonus Points');
    }

    ngOnInit(): void {

        this.route.queryParams
            .subscribe((params) => {
                this.seasonUuid = params.seasonUuid;
            });

        this.http
            .get<Player[]>(environment.apiUrl + 'seasons/' + this.seasonUuid + '/players')
            .pipe(map((result) => plainToClass(Player, result)))
            .subscribe((result) => {
                this.players = result;
            });

        this.http
            .get<Season>(environment.apiUrl + 'seasons/' + this.seasonUuid)
            .pipe(map((result) => plainToClass(Season, result)))
            .subscribe((result) => {
                this.season = result;
                this.titleService.setTitle('Season ' + this.season.seasonNumber + ' | Bonus Points');
            });

        this.loadCurrentList();
    }

    private loadCurrentList() {
        this.http
            .get<BonusPoint[]>(environment.apiUrl + 'bonusPoints/season/' + this.seasonUuid)
            .pipe(map((result) => plainToClass(BonusPoint, result)))
            .subscribe((result) => {
                this.currentBonusPointsForSeason = result;
                console.log(this.currentBonusPointsForSeason);
            });
    }

    isProperData(): boolean {
        return this.winner !== this.looser && this.points > 0
    }

    submit(): void {
        const params = new HttpParams()
            .set('winnerUuid', this.winner.uuid)
            .set('looserUuid', this.looser.uuid)
            .set('seasonUuid', this.seasonUuid)
            .set('points', String(this.points));

        this.http.post<any>(environment.apiUrl + 'bonusPoints', params)
            .subscribe(
                () => {
                    console.log('Request went fine');
                    this.snackBar.open("All went fine", 'X', {
                        duration: 7 * 1000,
                        panelClass: ['mat-toolbar', 'mat-primary'],
                    });
                    this.loadCurrentList();
                },
                (error) => {
                    console.log('ERROR!', error);
                }
            );

        this.winner = null;
        this.looser = null;
        this.points = null;
    }

}
