import {RoundScoreboard} from "../shared/rest-api-dto/round-scoreboard.model";
import {Component, Input} from "@angular/core";
import packageInfo from 'package.json';

@Component({
    selector: 'app-round-matches-printable-view',
    templateUrl: './round-matches-printable-view.component.html',
    styleUrls: ['./round-matches-printable-view.component.css']
})
export class RoundMatchesPrintableViewComponent {

    version = packageInfo.version

    @Input() roundScoreboard: RoundScoreboard;

    constructor() {
    }

    printRound() {
        window.print();
    }

}
