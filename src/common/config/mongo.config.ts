export interface MongoDbConfig {
  url: string;
  dbName: string;
  port: number;
  replicaSet: string;
  replicaMode: boolean;
}
