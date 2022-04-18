import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {LostBallsTableComponent} from './lost-balls-table.component';

describe('BonusPointsTableComponent', () => {
  let component: LostBallsTableComponent;
  let fixture: ComponentFixture<LostBallsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LostBallsTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostBallsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
