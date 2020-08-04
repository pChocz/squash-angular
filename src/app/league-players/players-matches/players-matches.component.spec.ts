import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersMatchesComponent } from './players-matches.component';

describe('PlayersMatchesComponent', () => {
  let component: PlayersMatchesComponent;
  let fixture: ComponentFixture<PlayersMatchesComponent>;

  beforeEach(async(() => {
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
