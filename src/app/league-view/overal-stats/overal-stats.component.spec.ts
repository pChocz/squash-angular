import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OveralStatsComponent } from './overal-stats.component';

describe('OveralStatsComponent', () => {
  let component: OveralStatsComponent;
  let fixture: ComponentFixture<OveralStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OveralStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OveralStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
