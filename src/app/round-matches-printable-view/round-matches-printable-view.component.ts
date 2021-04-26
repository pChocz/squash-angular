import {RoundScoreboard} from "../shared/rest-api-dto/round-scoreboard.model";
import {Component, Input} from "@angular/core";
import {version} from 'package.json';
import {Router} from "@angular/router";

@Component({
    selector: 'app-round-matches-printable-view',
    templateUrl: './round-matches-printable-view.component.html',
    styleUrls: ['./round-matches-printable-view.component.css']
})
export class RoundMatchesPrintableViewComponent {

    version = version

    @Input() roundScoreboard: RoundScoreboard;

    constructor() {
    }

    printRound() {
        window.print();
    }

}
