import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {LeaguesSummaryComponent} from './leagues-summary.component';

describe('LeaguesSummaryComponent', () => {
  let component: LeaguesSummaryComponent;
  let fixture: ComponentFixture<LeaguesSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LeaguesSummaryComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
