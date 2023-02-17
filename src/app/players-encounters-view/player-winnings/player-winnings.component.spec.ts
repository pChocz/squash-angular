import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerWinningsComponent } from './player-winnings.component';

describe('PlayerWinningsComponent', () => {
  let component: PlayerWinningsComponent;
  let fixture: ComponentFixture<PlayerWinningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerWinningsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerWinningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
