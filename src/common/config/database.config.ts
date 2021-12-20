//TODO change verification actions add all of them in one place use code later
export interface MysqlConfig {
  // user: string;
  // password: string;
  // host: string;
  // port: number;

  dialect: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  timezone: string;
  ssl: boolean;
}
