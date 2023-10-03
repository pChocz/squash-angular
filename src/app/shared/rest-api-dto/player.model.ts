export class Player {

    public uuid: string;
    public username: string;
    public emoji: string;
    public enabled: boolean;
    public nonLocked: boolean;

    public toString(): string {
        return this.username;
    }

}
