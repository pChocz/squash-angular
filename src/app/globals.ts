import {Injectable} from '@angular/core';

Injectable()

export class Globals {

    // token headers
    static JWT_TOKEN_HEADER = 'Authorization';
    static REFRESH_TOKEN_HEADER = 'Refresh';

    // localStorage keys
    static STORAGE_JWT_TOKEN_KEY = 'token';
    static STORAGE_REFRESH_TOKEN_KEY = 'refresh';
    static STORAGE_THEME_KEY = 'theme';
    static STORAGE_LANGUAGE_KEY = 'lang';

    // UI themes
    static DARK_MODE = 'darkMode';
    static LIGHT_MODE = 'lightMode';

    static MATCH_TYPES = [
        'BONUS',
        'FRIENDLY',
        'CUP',
        'CUP_FINALE',
        'SUPERCUP',
        'OTHER'
    ];

    static RULE_TYPES = [
        'ROUND',
        'SEASON',
        'PAYMENT',
        'OTHER'
    ];

    // match score types

    SERVE_SIDES: string[] = [
        'LEFT_SIDE',
        'RIGHT_SIDE'
    ];

    SERVE_PLAYERS: string[] = [
        'FIRST_PLAYER',
        'SECOND_PLAYER'
    ];

    SCORE_EVENT_TYPE: string[] = [
        'FIRST_PLAYER_CALLS_LET',
        'SECOND_PLAYER_CALLS_LET',

        'GAME_BEGINS',
        'GAME_ENDS',

        'MATCH_BEGINS',
        'MATCH_ENDS',

        'FIRST_PLAYER_SCORES',
        'SECOND_PLAYER_SCORES',
    ];

    APPEAL_DECISION: string[] = [
        'YES_LET',
        'NO_LET',
        'STROKE'
    ];
}
