import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreSheetTableComponent } from './score-sheet-table.component';

describe('ScoreSheetTableComponent', () => {
  let component: ScoreSheetTableComponent;
  let fixture: ComponentFixture<ScoreSheetTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreSheetTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreSheetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
