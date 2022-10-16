import {Component, Input, OnInit} from '@angular/core';
import {RoundGroupScoreboard} from '../../shared/rest-api-dto/round-group-scoreboard.model';
import {Router} from "@angular/router";
import {formatDate} from "@angular/common";

@Component({
    selector: 'app-round-group-scoreboard',
    templateUrl: './round-group-scoreboard.component.html',
    styleUrls: ['./round-group-scoreboard.component.css'],
})
export class RoundGroupScoreboardComponent implements OnInit {

    @Input() roundGroupScoreboard: RoundGroupScoreboard;

    displayedColumns: string[] = [
        'place-in-round-column',
        'place-in-group-column',
        'xp-earned-column',
        'emoji-column',
        'player-column',
        'matches-plus-column',
        'matches-minus-column',
        'matches-balance-column',
        'sets-plus-column',
        'sets-minus-column',
        'sets-balance-column',
        'points-plus-column',
        'points-minus-column',
        'points-balance-column',
    ];

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    navigateToPlayerStats(): void {
        let leagueUuid = this.roundGroupScoreboard.matches[0].leagueUuid;
        let playerUuids = this.roundGroupScoreboard.scoreboardRows.map(row => row.player.uuid);
        let roundDateMinusOneDay = new Date(this.roundGroupScoreboard.matches[0].date);
        roundDateMinusOneDay.setDate(roundDateMinusOneDay.getDate() - 1);
        let roundDateMinusOneYear = new Date(this.roundGroupScoreboard.matches[0].date);
        roundDateMinusOneYear.setFullYear(roundDateMinusOneDay.getFullYear() - 1);

        this.router.navigate(
            [
                `/league-players`,
                leagueUuid
            ],
            {
                queryParams: {
                    players: playerUuids.toString(),
                    dateFrom: formatDate(roundDateMinusOneYear, 'yyyy-MM-dd', 'en-US'),
                    dateTo: formatDate(roundDateMinusOneDay, 'yyyy-MM-dd', 'en-US')
                },
                skipLocationChange: true
            });
    }
}
