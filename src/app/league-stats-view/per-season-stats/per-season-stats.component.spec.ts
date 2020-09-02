import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerSeasonStatsComponent } from './per-season-stats.component';

describe('PerSeasonStatsComponent', () => {
  let component: PerSeasonStatsComponent;
  let fixture: ComponentFixture<PerSeasonStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerSeasonStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerSeasonStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
