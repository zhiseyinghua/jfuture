export class DynamoDBService {
  public static computeHash(prefix: string): string {
    let date = new Date().toISOString().substr(0, 10);
    return prefix + '-' + date;
  }
}
