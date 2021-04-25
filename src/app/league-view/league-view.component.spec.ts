import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueViewComponent } from './league-view.component';

describe('LeagueViewComponent', () => {
  let component: LeagueViewComponent;
  let fixture: ComponentFixture<LeagueViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeagueViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
