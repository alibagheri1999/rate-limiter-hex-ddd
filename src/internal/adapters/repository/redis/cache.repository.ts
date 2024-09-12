import * as cache from "../../cache";
import { RedisClientType } from "redis";
import { TYPES } from "../../../domain/types";
import { inject, injectable } from "inversify";
import { ICacheRepository } from "../../../ports";
import { Logger, PREFIXES } from "../../../application/utils/log";

@injectable()
export class RedisCacheRepository implements ICacheRepository {
  constructor(
    @inject(TYPES.Redis) private cache: cache.Redis,
    @inject(TYPES.Logger) private logger: Logger
  ) {
    this.cache.client = this.cache.client as RedisClientType;
  }

  private timeoutPromise =(timeout: number)=> new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Operation timed out')), timeout)
  )

  async get(key: string): Promise<string | null> {
    if (!(await this.ping())) return null;
    return await this.cache.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    if (!(await this.ping())) return;
    await this.cache.client.set(key, value);
  }

  async setWithTimeout(key: string, value: string, time: number): Promise<void> {
    if (!(await this.ping())) return;
    try {
      await this.cache.client.set(key, value);
      setTimeout(async () => {
        await this.delete(key);
      }, time * 60 * 1000);
    } catch (e) {
      this.logger.print(PREFIXES.REDIS, e as Error, "setWithTimeout Error");
    }
  }

  async delete(key: string): Promise<void> {
    if (!(await this.ping())) return;
    await this.cache.client.del(key);
  }

  private async ping(): Promise<boolean> {
    try {
      let pong = this.cache.client.ping();
      pong = await Promise.race([pong, this.timeoutPromise(5000)])
      return pong === "PONG";
    } catch (e) {
      return false;
    }
  }
}
