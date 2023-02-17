import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersEncountersViewComponent } from './players-encounters-view.component';

describe('PlayersEncountersViewComponent', () => {
  let component: PlayersEncountersViewComponent;
  let fixture: ComponentFixture<PlayersEncountersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayersEncountersViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayersEncountersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
