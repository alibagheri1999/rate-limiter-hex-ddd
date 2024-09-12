import { CONFIG } from "../../../../deploy";
import { createClient } from "redis";
import { Logger, PREFIXES } from "../../../application/utils/log";
import { delay } from "../../../application/utils/";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../domain/types";

@injectable()
export class Redis {
  public client: any;

  constructor(
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG,
    @inject(TYPES.Logger) private logger: Logger
  ) {
    this.connect().then().catch();
  }

  async connect() {
    try {
      const redisClient = createClient({
        socket: {
          host: this.cfg.cacheHost,
          port: this.cfg.cachePort
        }
      });

      redisClient.on("error", async (err) => {
        await delay(5000);
        this.logger.print(
          PREFIXES.REDIS,
          err as Error,
          "error occurred while connecting redis instance",
          err.message
        );
      });

      await redisClient.connect();

      this.client = redisClient;

      this.logger.print(PREFIXES.REDIS, null, "Connected successfully to redis cache");
    } catch (e) {
      await delay(5000);
      this.logger.print(
        PREFIXES.REDIS,
        e as Error,
        "error occurred while creating redis instance",
        e
      );
    }
  }

  public static async setup(cfg: CONFIG) {}
}
