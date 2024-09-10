import { Options } from "swagger-jsdoc";

export type CONFIG = {
  host: string;
  port: number;
  username: string;
  password: string;
  dbName: string;
  cachePort: number,
  cacheHost: string,
  httpServerPort: number;
  websocketServerPort: number;
  grpcServerPort: number;
  logFormat: string;
  staticFolder: string;
  postgresHost: string;
  postgresPort: number;
  postgresDbName: string;
  postgresUsername: string;
  postgresPassword: string;
  jwtSecretKey: string;
  debugMode: boolean;
  jsDocOptions: Options;
  clusterMode: boolean;
  rateLimitTime: number;
  maxRateLimit: number;
};
