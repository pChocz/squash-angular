import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeaguesAdminViewComponent} from './leagues-admin-view.component';

describe('LeaguesAdminViewComponent', () => {
  let component: LeaguesAdminViewComponent;
  let fixture: ComponentFixture<LeaguesAdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaguesAdminViewComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguesAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
