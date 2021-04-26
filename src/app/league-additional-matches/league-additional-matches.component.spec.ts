import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueAdditionalMatchesComponent } from './league-additional-matches.component';

describe('LeagueAdditionalMatchesComponent', () => {
  let component: LeagueAdditionalMatchesComponent;
  let fixture: ComponentFixture<LeagueAdditionalMatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeagueAdditionalMatchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueAdditionalMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
