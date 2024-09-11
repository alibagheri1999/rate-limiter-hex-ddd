import { CONFIG } from "./type";
import path from "path";

export const APP_CONFIG: CONFIG = {
  clusterMode: process.env.CLUSTER_MODE === "true" || true,
  host: process.env.MONGO_HOST || "localhost",
  port: process.env.MONGO_CONTAINER_PORT ? +process.env.MONGO_CONTAINER_PORT : 27017,
  username: process.env.MONGO_USERNAME || "root",
  password: process.env.MONGO_PASSWORD || "example",
  dbName: process.env.MONGO_DB || "myCollection",
  cachePort: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
  cacheHost: process.env.REDIS_HOST || "localhost",
  httpServerPort: process.env.HTTP_SERVER_CONTAINER_PORT ? +process.env.HTTP_SERVER_CONTAINER_PORT : 3000,
  maxRateLimit: process.env.MAX_RATE_LIMIT ? +process.env.MAX_RATE_LIMIT : 1,
  maxLogFileSize: process.env.MAX_LOG_FILE_SIZE ? +process.env.MAX_LOG_FILE_SIZE : 50000000,
  rateLimitTime: process.env.RATE_LIMIT_TIME_MIN ? +process.env.RATE_LIMIT_TIME_MIN : 1,
  websocketServerPort: process.env.WEBSOCKET_SERVER_CONTAINER_PORT ? +process.env.WEBSOCKET_SERVER_CONTAINER_PORT : 4000,
  grpcServerPort: process.env.GRPC_SERVER_CONTAINER_PORT ? +process.env.GRPC_SERVER_CONTAINER_PORT : 5000,
  logFormat: "HTTP {{req.method}} {{req.url}}",
  staticFolder: path.resolve("src", "static"),
  postgresHost: process.env.PG_HOST || "localhost",
  postgresPort: process.env.PG_CONTAINER_PORT ? +process.env.PG_CONTAINER_PORT : 5432,
  postgresUsername: process.env.PG_USERNAME || "postgres",
  postgresPassword: process.env.PG_PASSWORD || "changeme",
  postgresDbName: (process.env.PG_DB || "myCollection").toLowerCase(),
  jwtSecretKey: process.env.JWT_SECRET_KEY || "veryStrongKey:)",
  debugMode: Boolean(process.env.DEBUG_MODE === "true") || true,
  jsDocOptions: {
    definition: {
      components: {
        /* ... */
        securitySchemes: {
          ApiKeyAuth: {
            type: "apiKey",
            in: "header",
            name: "pal-auth"
          }
        }
      },
      openapi: "3.0.0",
      security: [
        {
          ApiKeyAuth: []
        }
      ],
      info: {
        title: "Library API",
        version: "1.0.0",
        description: "A simple Express Library API"
      },
      servers: [
        {
          url: "http://localhost:3000"
        }
      ]
    },
    apis: [path.resolve("src", "doc", "swagger", "*.js")]
  }
};
