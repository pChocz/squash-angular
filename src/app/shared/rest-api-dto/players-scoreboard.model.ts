import {Type} from 'class-transformer';
import {RoundGroupScoreboardRow} from 'src/app/shared/rest-api-dto/round-group-scoreboard-row.model';

export class PlayersScoreboard {
    public numberOfMatches: number;
    public leagueName: string;
    public leagueLogo: string;

    @Type(() => RoundGroupScoreboardRow)
    public scoreboardRows: RoundGroupScoreboardRow[];

    public extractPlayerNames(): string {
        let playerNames: string = '';
        this.scoreboardRows.forEach(row => {
            playerNames += row.player.username + ', ';
        })
        if (playerNames.length > 3) {
            return playerNames.substr(0, playerNames.length - 2);
        }
    }
}
