import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AppStatsViewComponent} from './app-stats-view.component';

describe('AppStatsViewComponent', () => {
  let component: AppStatsViewComponent;
  let fixture: ComponentFixture<AppStatsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppStatsViewComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppStatsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
