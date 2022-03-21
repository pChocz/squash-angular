import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueActionsButtonsComponent } from './league-actions-buttons.component';

describe('LeagueActionsButtonsComponent', () => {
  let component: LeagueActionsButtonsComponent;
  let fixture: ComponentFixture<LeagueActionsButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeagueActionsButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueActionsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
