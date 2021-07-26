import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CountUpTileSixComponent} from './count-up-tile-six.component';

describe('CountUpTileSixComponent', () => {
  let component: CountUpTileSixComponent;
  let fixture: ComponentFixture<CountUpTileSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountUpTileSixComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountUpTileSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
