export class Player {

  public uuid: string;
  public username: string;
  public emoji: string;

  public toString(): string {
    return this.username;
  }

}
