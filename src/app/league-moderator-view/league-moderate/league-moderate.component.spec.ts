import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueModerateComponent } from './league-moderate.component';

describe('LeagueModerateComponent', () => {
  let component: LeagueModerateComponent;
  let fixture: ComponentFixture<LeagueModerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeagueModerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
