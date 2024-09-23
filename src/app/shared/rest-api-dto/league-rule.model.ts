import {Type} from "class-transformer";
import {Audit} from "./audit.model";

export class LeagueRule {
    public uuid: string;
    public rule: string;
    public type: string;
    public orderValue: number;

    @Type(() => Audit)
    public audit: Audit;
}
