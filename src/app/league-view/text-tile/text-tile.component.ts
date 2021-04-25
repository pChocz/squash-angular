import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-text-tile',
  templateUrl: './text-tile.component.html',
  styleUrls: ['./text-tile.component.css']
})
export class TextTileComponent implements OnInit {

  @Input() title: string;
  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
  }

}
