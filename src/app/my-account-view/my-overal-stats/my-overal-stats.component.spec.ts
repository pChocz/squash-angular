import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOveralStatsComponent } from './my-overal-stats.component';

describe('MyOveralStatsComponent', () => {
  let component: MyOveralStatsComponent;
  let fixture: ComponentFixture<MyOveralStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOveralStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOveralStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
