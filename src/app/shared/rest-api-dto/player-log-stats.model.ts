export class PlayerLogStats {
  public player: string;
  public numberOfQueries: number;
  public numberOfRequests: number;
  public numberOfDatabaseQueries: number;
  public numberOfFrontendRefreshes: number;
  public totalTimeMillis: number;
  public logEntriesMessages: string[];
}
