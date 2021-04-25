import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountUpTileComponent } from './count-up-tile.component';

describe('CountUpTileComponent', () => {
  let component: CountUpTileComponent;
  let fixture: ComponentFixture<CountUpTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountUpTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountUpTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
