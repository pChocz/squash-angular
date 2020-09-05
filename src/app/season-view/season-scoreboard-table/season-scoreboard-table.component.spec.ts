import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonScoreboardTableComponent } from './season-scoreboard-table.component';

describe('SeasonScoreboardTableComponent', () => {
  let component: SeasonScoreboardTableComponent;
  let fixture: ComponentFixture<SeasonScoreboardTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonScoreboardTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonScoreboardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
