import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCoffeeViewComponent } from './buy-coffee-view.component';

describe('BuyCoffeeViewComponent', () => {
  let component: BuyCoffeeViewComponent;
  let fixture: ComponentFixture<BuyCoffeeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyCoffeeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyCoffeeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
