import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueStatsViewComponent } from './league-stats-view.component';

describe('LeagueStatsViewComponent', () => {
  let component: LeagueStatsViewComponent;
  let fixture: ComponentFixture<LeagueStatsViewComponent>;

  beforeEach(async(() => {
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
