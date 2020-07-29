import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundGroupScoreboardComponent } from './round-group-scoreboard.component';

describe('RoundGroupScoreboardComponent', () => {
  let component: RoundGroupScoreboardComponent;
  let fixture: ComponentFixture<RoundGroupScoreboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundGroupScoreboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundGroupScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
