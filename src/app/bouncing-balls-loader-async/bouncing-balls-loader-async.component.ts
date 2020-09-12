import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bouncing-balls-loader-async',
  templateUrl: './bouncing-balls-loader-async.component.html',
  styleUrls: ['./bouncing-balls-loader-async.component.css']
})
export class BouncingBallsLoaderAsyncComponent implements OnInit {

  @Input() message: string = "Loading";

  constructor() {
  }

  ngOnInit(): void {
  }

}
