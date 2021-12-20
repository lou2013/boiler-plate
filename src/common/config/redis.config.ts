export interface RedisConfig {
  name: string;
  host: string;
  port: number;
  db: number;
  username: string;
  password: string;
  keyPrefix: string;
}
