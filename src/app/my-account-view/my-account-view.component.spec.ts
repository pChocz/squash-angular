import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountViewComponent } from './my-account-view.component';

describe('MyAccountViewComponent', () => {
  let component: MyAccountViewComponent;
  let fixture: ComponentFixture<MyAccountViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAccountViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
