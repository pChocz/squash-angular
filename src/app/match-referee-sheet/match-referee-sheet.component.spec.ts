import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchRefereeSheetComponent } from './match-referee-sheet.component';

describe('MatchRefereeSheetComponent', () => {
  let component: MatchRefereeSheetComponent;
  let fixture: ComponentFixture<MatchRefereeSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchRefereeSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchRefereeSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
