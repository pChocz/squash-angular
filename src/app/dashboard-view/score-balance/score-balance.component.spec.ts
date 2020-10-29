import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreBalanceComponent } from './score-balance.component';

describe('ScoreBalanceComponent', () => {
  let component: ScoreBalanceComponent;
  let fixture: ComponentFixture<ScoreBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
