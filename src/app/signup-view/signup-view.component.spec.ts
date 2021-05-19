import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SignupViewComponent} from './signup-view.component';

describe('SignupViewComponent', () => {
    let component: SignupViewComponent;
    let fixture: ComponentFixture<SignupViewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SignupViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
