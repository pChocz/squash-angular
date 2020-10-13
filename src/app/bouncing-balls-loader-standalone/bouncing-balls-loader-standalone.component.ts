import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bouncing-balls-loader-standalone',
  templateUrl: './bouncing-balls-loader-standalone.component.html',
  styleUrls: ['./bouncing-balls-loader-standalone.component.css']
})
export class BouncingBallsLoaderStandaloneComponent implements OnInit {

  @Input() message: string = "Loading";

  constructor() {
  }

  ngOnInit(): void {
  }

}
