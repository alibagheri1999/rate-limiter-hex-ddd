import { Options } from "swagger-jsdoc";

export type CONFIG = {
  cachePort: number;
  cacheHost: string;
  httpServerPort: number;
  postgresHost: string;
  postgresPort: number;
  postgresDbName: string;
  postgresUsername: string;
  postgresPassword: string;
  debugMode: boolean;
  jsDocOptions: Options;
  clusterMode: boolean;
  rateLimitTime: number;
  maxRateLimit: number;
  maxLogFileSize: number;
  cacheDuration: number;
  runMigration: boolean;
};
