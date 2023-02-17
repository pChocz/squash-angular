import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinningBalanceComponent } from './winning-balance.component';

describe('WinningBalanceComponent', () => {
  let component: WinningBalanceComponent;
  let fixture: ComponentFixture<WinningBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinningBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinningBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
