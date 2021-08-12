import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormViewComponent } from './contact-form-view.component';

describe('ContactFormViewComponent', () => {
  let component: ContactFormViewComponent;
  let fixture: ComponentFixture<ContactFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactFormViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
