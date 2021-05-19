import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PlayersAdminViewComponent} from './players-admin-view.component';

describe('PlayersAdminViewComponent', () => {
    let component: PlayersAdminViewComponent;
    let fixture: ComponentFixture<PlayersAdminViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayersAdminViewComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayersAdminViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
