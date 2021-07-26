import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeagueBoardComponent} from './league-board.component';

describe('LeagueBoardComponent', () => {
  let component: LeagueBoardComponent;
  let fixture: ComponentFixture<LeagueBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeagueBoardComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
