import {PresenceForCourt} from "./presence-for-court.model";

export class PlayerForCourt {
  public name: string;
  public presences: PresenceForCourt[];
  public toPay: number;

  constructor(name: string) {
    this.name = name;
    this.presences = [
        new PresenceForCourt(),
        new PresenceForCourt(),
        new PresenceForCourt()
    ];
    this.toPay = 0;
  }
}
