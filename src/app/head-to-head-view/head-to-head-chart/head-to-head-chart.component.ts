import {Component, Input, OnInit} from '@angular/core';
import {HeadToHeadChartRow} from "../../shared/rest-api-dto/head-to-head-chart-row.model";

@Component({
    selector: 'app-head-to-head-chart',
    templateUrl: './head-to-head-chart.component.html',
    styleUrls: ['./head-to-head-chart.component.css']
})
export class HeadToHeadChartComponent implements OnInit {

    @Input() rows: HeadToHeadChartRow[];

    constructor() {
    }

    ngOnInit(): void {
    }

}
