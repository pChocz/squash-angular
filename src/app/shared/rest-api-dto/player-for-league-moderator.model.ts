
export class PlayerForLeagueModerator {

  public uuid: string;
  public username: string;
  public emoji: string;
  public leagueRoles: string[];

  isPlayer(): boolean {
    return this.leagueRoles.includes('PLAYER');
  }

  isModerator(): boolean {
    return this.leagueRoles.includes('MODERATOR');
  }

}
