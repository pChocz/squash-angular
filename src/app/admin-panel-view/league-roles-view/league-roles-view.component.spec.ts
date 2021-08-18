import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueRolesViewComponent } from './league-roles-view.component';

describe('LeagueRolesViewComponent', () => {
  let component: LeagueRolesViewComponent;
  let fixture: ComponentFixture<LeagueRolesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeagueRolesViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueRolesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
