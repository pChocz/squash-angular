import {Player} from "./player.model";
import {PlayersEncounter} from "./players-encounter.model";
import {PerPlayerEncountersStatsResults} from "./per-player-encounters-stats-results.model";

export class PlayersEncountersStatsResults {

    public encountersCount: number = 0;
    public firstPlayerStatsResults: PerPlayerEncountersStatsResults;
    public secondPlayerStatsResults: PerPlayerEncountersStatsResults;

    public build(playersEncounters: PlayersEncounter[],
                 firstPlayer: Player, secondPlayer: Player): void {

        this.encountersCount = playersEncounters.length;
        this.firstPlayerStatsResults = new PerPlayerEncountersStatsResults(firstPlayer, playersEncounters.length);
        this.secondPlayerStatsResults = new PerPlayerEncountersStatsResults(secondPlayer, playersEncounters.length);

        for (let playersEncounter of playersEncounters) {
            if (playersEncounter.winner.uuid === firstPlayer.uuid) {
                this.applyForPlayer(playersEncounter, this.firstPlayerStatsResults);
            }
            if (playersEncounter.winner.uuid === secondPlayer.uuid) {
                this.applyForPlayer(playersEncounter, this.secondPlayerStatsResults);
            }
        }
    }

    private applyForPlayer(playersEncounter: PlayersEncounter, playerStatsResults: PerPlayerEncountersStatsResults) {
        playerStatsResults.winnings++;

        if (playersEncounter.winningType === 'BY_GROUPS') {
            playerStatsResults.winningsByGroups++;

        } else if (playersEncounter.winningType === 'BY_MATCHES') {
            playerStatsResults.winningsByMatches++;
            if (playersEncounter.winner.uuid !== playersEncounter.directMatch.winner.uuid) {
                playerStatsResults.winningsByMatchesWithMatchLost++;
            }

        } else if (playersEncounter.winningType === 'BY_GAMES') {
            playerStatsResults.winningsByGames++;
            if (playersEncounter.winner.uuid !== playersEncounter.directMatch.winner.uuid) {
                playerStatsResults.winningsByGamesWithMatchLost++;
            }

        } else if (playersEncounter.winningType === 'BY_RALLIES') {
            playerStatsResults.winningsByRallies++;
            if (playersEncounter.winner.uuid !== playersEncounter.directMatch.winner.uuid) {
                playerStatsResults.winningsByRalliesWithMatchLost++;
            }
        }
    }
}
