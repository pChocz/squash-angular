import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SeasonBalancesTableComponent } from './season-balances-table.component';

describe('SeasonBalancesTableComponent', () => {
  let component: SeasonBalancesTableComponent;
  let fixture: ComponentFixture<SeasonBalancesTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonBalancesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonBalancesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
