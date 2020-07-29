import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguePlayersComponent } from './league-players.component';

describe('LeaguePlayersComponent', () => {
  let component: LeaguePlayersComponent;
  let fixture: ComponentFixture<LeaguePlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaguePlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguePlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
