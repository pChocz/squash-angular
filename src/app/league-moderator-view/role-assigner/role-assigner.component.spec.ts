import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAssignerComponent } from './role-assigner.component';

describe('RoleAssignerComponent', () => {
  let component: RoleAssignerComponent;
  let fixture: ComponentFixture<RoleAssignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleAssignerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAssignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
