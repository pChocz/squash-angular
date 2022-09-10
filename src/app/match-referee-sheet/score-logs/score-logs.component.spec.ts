import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreLogsComponent } from './score-logs.component';

describe('ScoreLogsComponent', () => {
  let component: ScoreLogsComponent;
  let fixture: ComponentFixture<ScoreLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
