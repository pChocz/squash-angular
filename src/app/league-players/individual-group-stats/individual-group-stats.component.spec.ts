import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualGroupStatsComponent } from './individual-group-stats.component';

describe('IndividualGroupStatsComponent', () => {
  let component: IndividualGroupStatsComponent;
  let fixture: ComponentFixture<IndividualGroupStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualGroupStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualGroupStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
