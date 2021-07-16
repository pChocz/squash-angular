import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLeagueViewComponent } from './new-league-view.component';

describe('NewLeagueViewComponent', () => {
  let component: NewLeagueViewComponent;
  let fixture: ComponentFixture<NewLeagueViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewLeagueViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLeagueViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
