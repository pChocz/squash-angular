import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayersMatchesComponent } from './players-matches.component';

describe('PlayersMatchesComponent', () => {
  let component: PlayersMatchesComponent;
  let fixture: ComponentFixture<PlayersMatchesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
