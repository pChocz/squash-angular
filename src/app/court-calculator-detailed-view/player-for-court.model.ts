import {PresenceForCourt} from "./presence-for-court.model";

export class PlayerForCourt {
  public name: string;
  public presences: PresenceForCourt[];
  public toPay: number;
}
