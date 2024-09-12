import { CONFIG } from "./type";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: process.cwd() + "/src/deploy/env/.env"
});

export const APP_CONFIG: CONFIG = {
  clusterMode: Boolean(process.env.CLUSTER_MODE === "true"),
  cachePort: Number(process.env.REDIS_PORT),
  cacheHost: String(process.env.REDIS_HOST),
  httpServerPort: Number(process.env.HTTP_SERVER_CONTAINER_PORT),
  maxRateLimit: Number(process.env.MAX_RATE_LIMIT),
  rateLimitTime: Number(process.env.RATE_LIMIT_TIME_MIN),
  cacheDuration: process.env.CACHE_DURATION ? Number(process.env.CACHE_DURATION) : 1,
  maxLogFileSize: Number(process.env.MAX_LOG_FILE_SIZE),
  postgresHost: String(process.env.PG_HOST),
  postgresPort: Number(process.env.PG_CONTAINER_PORT),
  postgresUsername: String(process.env.PG_USERNAME),
  postgresPassword: String(process.env.PG_PASSWORD),
  postgresDbName: String(process.env.PG_DB),
  debugMode: Boolean(process.env.DEBUG_MODE === "true"),
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
    apis: [path.resolve("src", "cmd", "doc", "swagger", "*.js")]
  }
};
