import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAdminViewComponent } from './users-admin-view.component';

describe('UsersAdminViewComponent', () => {
  let component: UsersAdminViewComponent;
  let fixture: ComponentFixture<UsersAdminViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersAdminViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
