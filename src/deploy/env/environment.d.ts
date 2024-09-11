declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLUSTER_MODE: string;
      HTTP_SERVER_LOCAL_PORT: number;
      DEBUG_PORT: number;
      HTTP_SERVER_CONTAINER_PORT: number;
      PG_HOST: string;
      PG_USERNAME: string;
      PG_PASSWORD: string;
      PG_DB: string;
      PG_LOCAL_PORT: number;
      PG_CONTAINER_PORT: number;
      PGADMIN_PORT: number;
      DEBUG_MODE: string;
      RATE_LIMIT_TIME_MIN: number;
      MAX_RATE_LIMIT: number;
      MAX_LOG_FILE_SIZE: number;
      REDIS_PORT: number;
      REDIS_HOST: string;
    }
  }
}
export {};
