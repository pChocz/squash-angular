import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TextTileComponent} from './text-tile.component';

describe('TextTileComponent', () => {
  let component: TextTileComponent;
  let fixture: ComponentFixture<TextTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextTileComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
