import {PlayerForCourt} from "./player-for-court.model";

export class CourtPay {
    public ratePerCourtPerHour: number;
    public singleMultisportDeduct: number;
    public courtsPerHour: number[];
    public totalPay: number;
    public multisportDeduct: number;
    public totalPayMultisportDeducted: number;
    public socialismMode: boolean;
    public players: PlayerForCourt[];

    constructor() {
        this.ratePerCourtPerHour = 70;
        this.singleMultisportDeduct = 15;
        this.courtsPerHour = [0, 0, 0];
        this.totalPay = 0;
        this.multisportDeduct = 0;
        this.totalPayMultisportDeducted = 0;
        this.socialismMode = false;
        this.players = [
            new PlayerForCourt('Player_' + 1),
            new PlayerForCourt('Player_' + 2),
            new PlayerForCourt('Player_' + 3)
        ];
    }
}
