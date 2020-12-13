import {HttpClient, HttpParams} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {Player} from "../shared/rest-api-dto/player.model";
import {map} from "rxjs/operators";
import {plainToClass} from "class-transformer";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Season} from "../shared/rest-api-dto/season.model";
import {BonusPoint} from "../shared/rest-api-dto/bonus-point.model";
import {ApiEndpointsService} from "../shared/api-endpoints.service";

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

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private route: ActivatedRoute,
                private router: Router,
                private titleService: Title,
                private snackBar: MatSnackBar) {
        this.titleService.setTitle('Bonus Points');
    }

    ngOnInit(): void {
        this.route.queryParams
            .subscribe((params) => {
                this.seasonUuid = params.seasonUuid;
            });

        this.http
            .get<Player[]>(this.apiEndpointsService.getPlayersBySeasonUuid(this.seasonUuid))
            .pipe(map((result) => plainToClass(Player, result)))
            .subscribe((result) => {
                this.players = result;
            });

        this.http
            .get<Season>(this.apiEndpointsService.getSeasonByUuid(this.seasonUuid))
            .pipe(map((result) => plainToClass(Season, result)))
            .subscribe((result) => {
                this.season = result;
                this.titleService.setTitle('Season ' + this.season.seasonNumber + ' | Bonus Points');
            });

        this.loadCurrentList();
    }

    private loadCurrentList() {
        this.http
            .get<BonusPoint[]>(this.apiEndpointsService.getBonusPointsBySeasonUuid(this.seasonUuid))
            .pipe(map((result) => plainToClass(BonusPoint, result)))
            .subscribe((result) => {
                this.currentBonusPointsForSeason = result;
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

        this.http
            .post<any>(this.apiEndpointsService.getBonusPoints(), params)
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
