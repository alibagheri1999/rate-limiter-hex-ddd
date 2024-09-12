import fs from "fs";
import path from "path";
import { Logger, PREFIXES } from "../internal/application/utils/log";
import { Client } from "pg";
import { CONFIG } from "../deploy";
import { Postgres } from "../internal/adapters/store";
import { TYPES } from "../internal/domain/types";
import { inject, injectable } from "inversify";

@injectable()
export class Migrator {
  constructor(
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG,
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  async execMigrations(store: Postgres) {
    const fileNames = fs
      .readdirSync(path.resolve("src", "migrations"))
      .filter((fn) => fn.endsWith(".sql"));
    for (const fn of fileNames) {
      try {
        const query = fs.readFileSync(path.resolve("src", "migrations", fn)).toString();
        await store.client.query(query);
        this.logger.print(PREFIXES.MIGRATOR, null, `${fn} migration executed`);
      }catch (e: any) {
        this.logger.print(PREFIXES.MIGRATOR, e as Error, e?.message);
      }
    }
  }

  async dropTables(store: Postgres) {
    await store.client.query("DROP SCHEMA public CASCADE;CREATE SCHEMA public;");
    this.logger.print(PREFIXES.MIGRATOR, null, "all tables dropped");
  }
}
