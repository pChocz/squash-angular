import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPlayerEditComponent } from './admin-player-edit.component';

describe('AdminPlayerEditComponent', () => {
  let component: AdminPlayerEditComponent;
  let fixture: ComponentFixture<AdminPlayerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPlayerEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPlayerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
