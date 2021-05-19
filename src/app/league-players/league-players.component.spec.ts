import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {LeaguePlayersComponent} from './league-players.component';

describe('LeaguePlayersComponent', () => {
    let component: LeaguePlayersComponent;
    let fixture: ComponentFixture<LeaguePlayersComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [LeaguePlayersComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LeaguePlayersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
