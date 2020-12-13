import {Injectable} from "@angular/core";
import {UrlBuilder} from "./url-builder";
import {QueryStringParameters} from "./query-string-parameters";
import {environment} from "../../environments/environment";

@Injectable()
export class ApiEndpointsService {

    constructor() {

    }

    public getPlayersBySeasonUuid(uuid: string) {
        return ApiEndpointsService.createUrlWithPathVariables('seasons', [uuid, 'players']);
    }

    public getSeasonByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('seasons', [uuid]);
    }

    public getBonusPointsBySeasonUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('bonusPoints', ['season', uuid]);
    }

    public getBonusPointByUuid(uuid: string): string {
        return ApiEndpointsService.createUrlWithPathVariables('bonusPoints', [uuid]);
    }

    public getBonusPoint(): string {
        return ApiEndpointsService.createUrlWithPathVariables('bonusPoints');
    }

    private static createUrl(action: string): string {
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiUrl,
            action
        );
        return urlBuilder.toString();
    }

    private static createUrlWithQueryParameters(action: string,
                                                queryStringHandler?: (queryStringParameters: QueryStringParameters) => void): string {
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiUrl,
            action
        );
        // Push extra query string params
        if (queryStringHandler) {
            queryStringHandler(urlBuilder.queryString);
        }
        return urlBuilder.toString();
    }

    private static createUrlWithPathVariables(action: string,
                                              pathVariables: any[] = []): string {
        let encodedPathVariablesUrl: string = '';
        // Push extra path variables
        for (const pathVariable of pathVariables) {
            if (pathVariable !== null) {
                encodedPathVariablesUrl +=
                    `/${encodeURIComponent(pathVariable.toString())}`;
            }
        }
        const urlBuilder: UrlBuilder = new UrlBuilder(
            environment.apiUrl,
            `${action}${encodedPathVariablesUrl}`
        );
        return urlBuilder.toString();
    }

}
