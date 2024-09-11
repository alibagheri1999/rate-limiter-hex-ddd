import * as cache from "../../cache";
import { RedisClientType } from "redis";
import { CONFIG } from "../../../../deploy";
import { TYPES } from "../../../domain/types";
import { inject, injectable } from "inversify";
import { ICacheRepository } from "../../../ports";
import { Logger, PREFIXES } from "../../../application/utils/log";

@injectable()
export class RedisCacheRepository implements ICacheRepository {
  constructor(
    @inject(TYPES.Redis) private cache: cache.Redis,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG,
    @inject(TYPES.Logger) private logger: Logger
  ) {
    this.cache.client = this.cache.client as RedisClientType;
  }

  async get(key: string): Promise<string | null> {
    return await this.cache.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.cache.client.set(key, value);
  }

  async setRateWithTimeout(key: string, value: string): Promise<void> {
    try {
      await this.cache.client.set(key, value);
      setTimeout(async () => {
        await this.cache.client.del(key);
      }, this.cfg.rateLimitTime * 60 * 1000);
    } catch (e) {
      this.logger.print(PREFIXES.GRPC_SERVER, e as Error, "setWithTimeout Error");
    }
  }

  async setWithTimeout(key: string, value: string, time: number): Promise<void> {
    try {
      await this.cache.client.set(key, value);
      setTimeout(async () => {
        await this.delete(key);
      }, time * 60 * 1000);
    } catch (e) {
      this.logger.print(PREFIXES.GRPC_SERVER, e as Error, "setWithTimeout Error");
    }
  }

  async delete(key: string): Promise<void> {
    await this.cache.client.del(key);
  }
}
