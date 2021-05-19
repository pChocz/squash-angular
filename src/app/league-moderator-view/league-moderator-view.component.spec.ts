import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LeagueModeratorViewComponent} from './league-moderator-view.component';

describe('LeagueModeratorViewComponent', () => {
    let component: LeagueModeratorViewComponent;
    let fixture: ComponentFixture<LeagueModeratorViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LeagueModeratorViewComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LeagueModeratorViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
