import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeagueLogoComponent} from './league-logo.component';

describe('LeagueLogoComponent', () => {
    let component: LeagueLogoComponent;
    let fixture: ComponentFixture<LeagueLogoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LeagueLogoComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LeagueLogoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
