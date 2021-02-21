import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-league-logo',
  templateUrl: './league-logo.component.html',
  styleUrls: ['./league-logo.component.css']
})
export class LeagueLogoComponent implements OnInit {

  @Input() logo: string;

  constructor() { }

  ngOnInit(): void {
  }

}
