import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayersScoreboardComponent } from './players-scoreboard.component';

describe('PlayersScoreboardComponent', () => {
  let component: PlayersScoreboardComponent;
  let fixture: ComponentFixture<PlayersScoreboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersScoreboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
