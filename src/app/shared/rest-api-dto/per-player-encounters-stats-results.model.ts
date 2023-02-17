import {Player} from "./player.model";

export class PerPlayerEncountersStatsResults {

    public player: Player;
    public encountersCount: number;
    public winnings: number = 0;
    public winningsWithMatchLost: number = 0;
    public winningsByGroups: number = 0;
    public winningsByMatches: number = 0;
    public winningsByMatchesWithMatchLost: number = 0;
    public winningsByGames: number = 0;
    public winningsByGamesWithMatchLost: number = 0;
    public winningsByRallies: number = 0;
    public winningsByRalliesWithMatchLost: number = 0;

    constructor(player: Player, encountersCount: number) {
        this.player = player;
        this.encountersCount = encountersCount;
    }
}
