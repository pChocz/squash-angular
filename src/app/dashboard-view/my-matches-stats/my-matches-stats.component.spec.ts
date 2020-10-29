import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMatchesStatsComponent } from './my-matches-stats.component';

describe('MyMatchesStatsComponent', () => {
  let component: MyMatchesStatsComponent;
  let fixture: ComponentFixture<MyMatchesStatsComponent>;

  beforeEach(async(() => {
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
