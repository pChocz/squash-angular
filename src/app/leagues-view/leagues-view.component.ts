import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leagues-view',
  templateUrl: './leagues-view.component.html',
  styleUrls: ['./leagues-view.component.css']
})
export class LeaguesViewComponent implements OnInit {

  favoriteSeason: string;
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  selected = 'option2';

  constructor() { }

  ngOnInit(): void {
  }

}
