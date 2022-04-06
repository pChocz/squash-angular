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

}
