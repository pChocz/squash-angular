import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MostRecentRoundComponent} from './most-recent-round.component';

describe('MostRecentRoundComponent', () => {
  let component: MostRecentRoundComponent;
  let fixture: ComponentFixture<MostRecentRoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostRecentRoundComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MostRecentRoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
