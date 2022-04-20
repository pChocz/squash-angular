import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TranslateService} from "@ngx-translate/core";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {ApiEndpointsService} from "../shared/api-endpoints.service";
import {Season} from "../shared/rest-api-dto/season.model";
import {FormControl, Validators} from "@angular/forms";
import {XpPointsPerRound} from "../shared/rest-api-dto/xp-points-per-round.model";

@Component({
    selector: 'app-season-modify-dialog',
    templateUrl: './season-modify-dialog.component.html',
})
export class SeasonModifyDialogComponent {

    seasonUuid: string;
    season: Season;
    seasonSplits: string[];
    xpPoints: XpPointsPerRound[];
    xpPointsTypes: string[];
    selectedXpPointsType: string;
    availableSplits: string[];

    seasonDescriptionField = new FormControl('', [
        Validators.maxLength(100),
    ]);

    constructor(
        private router: Router,
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private translateService: TranslateService,
        private apiEndpointsService: ApiEndpointsService,
        public dialogRef: MatDialogRef<SeasonModifyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { seasonUuid: string }) {

        this.seasonUuid = data.seasonUuid;

        this.loadAll();
    }

    onOkClick(): void {
        let descriptionChanged = this.season.description !== this.seasonDescriptionField.value;
        let xpPointsTypeChanged = this.season.xpPointsType !== this.selectedXpPointsType;

        let params = new HttpParams();

        if (xpPointsTypeChanged) {
            params = params.set('xpPointsType', this.selectedXpPointsType);
        }
        if (descriptionChanged) {
            params = params.set('description', this.seasonDescriptionField.value);
        }

        if (params.keys().length > 0) {
            this.http
                .put(this.apiEndpointsService.getSeasonByUuid(this.season.seasonUuid),
                    null,
                    {params: params}
                )
                .subscribe({
                    next: () => {
                        this.dialogRef.close();
                    }
                });
        }
    }

    getAvailableSplits() {
        return this.xpPoints
            .filter(xp => xp.type === this.selectedXpPointsType)
            .map(xp => xp.split);
    }

    hasSplit(split: string): boolean {
        return this.getAvailableSplits().includes(split);
    }

    hasAllSplits(): boolean {
        let availableSplits = this.getAvailableSplits();
        for (let split of this.seasonSplits) {
            if (!availableSplits.includes(split)) {
                return false;
            }
        }
        return true;
    }

    private loadAll() {
        this.http
            .get<Season>(this.apiEndpointsService.getSeasonByUuid(this.seasonUuid))
            .pipe(map(result => plainToInstance(Season, result)))
            .subscribe((result) => {
                this.season = result;
                this.selectedXpPointsType = this.season.xpPointsType;
                this.seasonDescriptionField.setValue(this.season.description);
                this.loadSeasonSplits();
                this.loadXpPoints();
            });
    }

    private loadSeasonSplits() {
        this.http
            .get<string[]>(this.apiEndpointsService.getSeasonSplitsByUuid(this.seasonUuid))
            .subscribe((result) => {
                this.seasonSplits = result
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .sort();
            });
    }

    private loadXpPoints() {
        this.http
            .get<XpPointsPerRound[]>(this.apiEndpointsService.getAllXpPoints())
            .pipe(map(result => plainToInstance(XpPointsPerRound, result)))
            .subscribe({
                next: (result) => {
                    this.xpPoints = result;
                    this.xpPointsTypes = this.xpPoints
                        .map(xp => xp.type)
                        .filter((v, i, a) => a.indexOf(v) === i);
                }
            });
    }
}
