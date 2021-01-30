import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeagueStatsViewComponent } from './league-stats-view.component';

describe('LeagueStatsViewComponent', () => {
  let component: LeagueStatsViewComponent;
  let fixture: ComponentFixture<LeagueStatsViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeagueStatsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueStatsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
