import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersMatchesViewComponent } from './players-matches-view.component';

describe('PlayersMatchesViewComponent', () => {
  let component: PlayersMatchesViewComponent;
  let fixture: ComponentFixture<PlayersMatchesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersMatchesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersMatchesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
