import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersModerateComponent } from './players-moderate.component';

describe('PlayersModerateComponent', () => {
  let component: PlayersModerateComponent;
  let fixture: ComponentFixture<PlayersModerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayersModerateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
