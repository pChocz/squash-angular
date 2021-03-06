import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ForgotPasswordViewComponent} from './forgot-password-view.component';

describe('ForgotPasswordViewComponent', () => {
    let component: ForgotPasswordViewComponent;
    let fixture: ComponentFixture<ForgotPasswordViewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ForgotPasswordViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotPasswordViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
