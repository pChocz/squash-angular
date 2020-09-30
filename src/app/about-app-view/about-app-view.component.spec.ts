import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAppViewComponent } from './about-app-view.component';

describe('AboutAppViewComponent', () => {
    let component: AboutAppViewComponent;
    let fixture: ComponentFixture<AboutAppViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AboutAppViewComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutAppViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
