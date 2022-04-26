import {Component, Input, OnInit} from '@angular/core';
import {LeagueRule} from "../../shared/rest-api-dto/league-rule.model";
import {map} from "rxjs/operators";
import {plainToInstance} from "class-transformer";
import {HttpClient} from "@angular/common/http";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {ConfirmationDialogComponent} from "../../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../shared/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {EditRuleDialogComponent} from "./edit-rule-dialog.component";
import {AddRuleDialogComponent} from "./add-rule-dialog.component";

@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

    @Input() isOwner: boolean;
    @Input() leagueUuid: string;

    isLoading: boolean;
    noData: boolean;

    rules: LeagueRule[];
    types: string[];

    constructor(private http: HttpClient,
                private apiEndpointsService: ApiEndpointsService,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
                private authService: AuthService,
                private translateService: TranslateService) {

    }

    ngOnInit(): void {
        this.setupComponent();
    }

    setupComponent(): void {
        this.isLoading = true;
        this.noData = false;

        this.http
            .get<LeagueRule[]>(this.apiEndpointsService.getLeagueRulesForLeague(this.leagueUuid))
            .pipe(map(result => plainToInstance(LeagueRule, result)))
            .subscribe((result) => {
                this.isLoading = false;
                this.noData = result.length === 0;

                this.rules = result;
                this.types = [...new Set(result.map(rule => rule.type).sort())];
            });
    }

    getRulesOfType(type: string): LeagueRule[] {
        return this.rules.filter(rule => rule.type === type);
    }

    openAddDialog() {
        const dialogRef = this.dialog.open(AddRuleDialogComponent, {
            data: {leagueUuid: this.leagueUuid},
            autoFocus: false
        });

        dialogRef.afterClosed()
            .subscribe({
                next: (result) => {
                    console.log(result);
                    if (result === true) {
                        this.setupComponent();
                    }
                }
            });
    }

    openModifyDialog(rule: LeagueRule) {
        const dialogRef = this.dialog.open(EditRuleDialogComponent, {
            data: {leagueRule: rule},
            autoFocus: false
        });

        dialogRef.afterClosed()
            .subscribe({
                next: (result) => {
                    console.log(result);
                    if (result === true) {
                        this.setupComponent();
                    }
                }
            });
    }

    onDeleteClick(leagueRule: LeagueRule): void {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {message: 'league.rule.remove.areYouSure', isRemoval: true},
            autoFocus: false
        });

        confirmationDialogRef.afterClosed()
            .subscribe({
                next: (result) => {
                    if (result === true) {
                        this.http
                            .delete(this.apiEndpointsService.getLeagueRuleByUuid(leagueRule.uuid))
                            .subscribe({
                                next: () => {
                                    this.setupComponent();
                                    this.translateService
                                        .get('league.rule.remove.done')
                                        .subscribe({
                                            next: (translation: string) => {
                                                this.snackBar.open(translation, 'X', {
                                                    duration: 7 * 1000,
                                                    panelClass: ['mat-toolbar', 'mat-primary'],
                                                });
                                            }
                                        });
                                }
                            });
                    }
                }
            });
    }

}
