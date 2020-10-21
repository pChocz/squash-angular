import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundsStatsComponent } from './rounds-stats.component';

describe('RoundsStatsComponent', () => {
  let component: RoundsStatsComponent;
  let fixture: ComponentFixture<RoundsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundsStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
