import {Component, Input, OnInit} from '@angular/core';
import {PlayerDetailed} from "../../shared/rest-api-dto/player-detailed.model";
import {AbstractControl, FormControl, ValidatorFn, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {League} from "../../shared/rest-api-dto/league.model";
import {ApiEndpointsService} from "../../shared/api-endpoints.service";
import {HttpClient} from "@angular/common/http";
import {plainToInstance} from "class-transformer";
import {NotificationService} from "../../shared/notification.service";


@Component({
    selector: 'app-league-roles-view',
    templateUrl: './league-roles-view.component.html',
    styleUrls: ['./league-roles-view.component.css']
})
export class LeagueRolesViewComponent implements OnInit {

    availableRoles: string[] = [
        'PLAYER',
        'MODERATOR',
        'OWNER',
    ];
    selectedRole: string = 'PLAYER';

    @Input() players: PlayerDetailed[];
    filteredPlayers: Observable<string[]>;
    playerControl = new FormControl('', [
        Validators.required,
        this.playerValidator(),
    ]);

    @Input() leagues: League[];
    filteredLeagues: Observable<string[]>;
    leagueControl = new FormControl('', [
        Validators.required,
        this.leagueValidator(),
    ]);

    constructor(private apiEndpointsService: ApiEndpointsService,
                private notificationService: NotificationService,
                private http: HttpClient) {
    }

    ngOnInit(): void {
        this.filteredPlayers = this.playerControl.valueChanges.pipe(
            startWith(''),
            map(value => {
                return this._filterPlayers(value);
            })
        );
        this.filteredLeagues = this.leagueControl.valueChanges.pipe(
            startWith(''),
            map(value => {
                return this._filterLeagues(value);
            })
        );
    }

    assignRoleForPlayer(assign: boolean): void {
        let playerName = this.playerControl.value.toLowerCase();
        let leagueName = this.leagueControl.value.toLowerCase();

        const selectedPlayer: PlayerDetailed = this.players.filter(player => player.username.toLowerCase() === playerName).pop();
        const selectedLeague: League = this.leagues.filter(league => league.leagueName.toLowerCase() === leagueName).pop();
        const playerUuid = selectedPlayer.uuid;
        const leagueUuid = selectedLeague.leagueUuid;
        const role = this.selectedRole;

        if (assign) {
            this.http
                .put(this.apiEndpointsService.getLeagueRolesByUuid(leagueUuid, playerUuid, role), {})
                .subscribe({
                    next: () => {
                        this.notificationService.success('league.moderate.role.assignSuccess');
                    },
                    complete: () => {
                        this.refreshPlayers();
                    }
                });

        } else {
            this.http
                .delete(this.apiEndpointsService.getLeagueRolesByUuid(leagueUuid, playerUuid, role), {})
                .subscribe({
                    next: () => {
                        this.notificationService.success('league.moderate.role.unassignSuccess');
                    },
                    complete: () => {
                        this.refreshPlayers();
                    }
                });
        }
    }


    refreshPlayers(): void {
        this.http
            .get<PlayerDetailed[]>(this.apiEndpointsService.getAllPlayers())
            .pipe(map((result) => plainToInstance(PlayerDetailed, result)))
            .subscribe((result) => {
                this.players = result;
            });
    }

    isPlayerValid(): boolean {
        let playerName: string = this.playerControl.value === null ? '' : this.playerControl.value.toLowerCase();
        return this.players.some(player => player.username.toLowerCase() === playerName);

    }

    isLeagueValid(): boolean {
        let leagueName: string = this.leagueControl.value === null ? '' : this.leagueControl.value.toLowerCase();
        return this.leagues.some(league => league.leagueName.toLowerCase() === leagueName);
    }

    playerValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value === '') {
                return null;
            } else if (this.players.some(player => player.username.toLowerCase() === control.value.toLowerCase())) {
                return null;
            } else {
                return {'invalid': {value: control.value}}
            }
        }
    }

    leagueValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value === '') {
                return null;
            } else if (this.leagues.some(league => league.leagueName.toLowerCase() === control.value.toLowerCase())) {
                return null;
            } else {
                return {'invalid': {value: control.value}}
            }
        }
    }

    leaguesWithRole(role: string): string {
        const playerName = this.playerControl.value.toLowerCase();
        const player: PlayerDetailed = this.players.filter(player => player.username.toLowerCase() === playerName).pop();
        return player.leagueRoles.filter(leagueRole => leagueRole.leagueRole === role).map(leagueRole => leagueRole.leagueName).join(", ");
    }

    hasSelectedRole(): boolean {
        const playerName = this.playerControl.value.toLowerCase();
        const leagueName = this.leagueControl.value.toLowerCase();
        const player: PlayerDetailed = this.players.filter(player => player.username.toLowerCase() === playerName).pop();
        const league: League = this.leagues.filter(league => league.leagueName.toLowerCase() === leagueName).pop();
        return player.hasRoleForLeague(league.leagueUuid, this.selectedRole);
    }

    private _filterPlayers(value): string[] {
        const filterValue = value.toLowerCase();
        return this.players.filter(player => player.username.toLowerCase().includes(filterValue)).map(player => player.username);
    }

    private _filterLeagues(value): string[] {
        const filterValue = value.toLowerCase();
        return this.leagues.filter(league => league.leagueName.toLowerCase().includes(filterValue)).map(league => league.leagueName);
    }

}
