import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ErrorNotFoundViewComponent} from './error-not-found-view.component';

describe('ErrorNotFoundViewComponent', () => {
    let component: ErrorNotFoundViewComponent;
    let fixture: ComponentFixture<ErrorNotFoundViewComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ErrorNotFoundViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorNotFoundViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
