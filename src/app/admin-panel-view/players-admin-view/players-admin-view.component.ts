import {Component, Input, OnInit} from '@angular/core';
import {PlayerDetailed} from "../../shared/rest-api-dto/player-detailed.model";

@Component({
  selector: 'app-players-admin-view',
  templateUrl: './players-admin-view.component.html',
  styleUrls: ['./players-admin-view.component.css']
})
export class PlayersAdminViewComponent implements OnInit {

  @Input() players: PlayerDetailed[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
