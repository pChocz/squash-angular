import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyMatchesStatsComponent } from './my-matches-stats.component';

describe('MyMatchesStatsComponent', () => {
  let component: MyMatchesStatsComponent;
  let fixture: ComponentFixture<MyMatchesStatsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMatchesStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMatchesStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
