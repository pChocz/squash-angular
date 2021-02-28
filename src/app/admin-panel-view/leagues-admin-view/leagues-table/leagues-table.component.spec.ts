import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaguesTableComponent } from './leagues-table.component';

describe('LeaguesTableComponent', () => {
  let component: LeaguesTableComponent;
  let fixture: ComponentFixture<LeaguesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaguesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaguesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
