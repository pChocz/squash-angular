import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RoundStatsScoreboardComponent } from './rounds-stats-scoreboard.component';

describe('RoundStatsScoreboardComponent', () => {
  let component: RoundStatsScoreboardComponent;
  let fixture: ComponentFixture<RoundStatsScoreboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundStatsScoreboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundStatsScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
