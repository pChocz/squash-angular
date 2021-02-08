import {RoundScoreboard} from "../shared/rest-api-dto/round-scoreboard.model";
import {formatDate} from "@angular/common";
import {Component, Input} from "@angular/core";

@Component({
    selector: 'app-round-matches-printable-view',
    templateUrl: './round-matches-printable-view.component.html',
    styleUrls: ['./round-matches-printable-view.component.css']
})
export class RoundMatchesPrintableViewComponent {

    @Input() roundScoreboard: RoundScoreboard;

    constructor() {
    }

    printRound() {
        window.print();
    }

}
