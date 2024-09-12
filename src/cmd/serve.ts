/*
    resolve default defined paths in package.json
*/

import * as dotenv from "dotenv";
import { HttpServer } from "./gateway";
import { Logger, PREFIXES } from "../internal/application/utils/log";
import { DI } from "./DI";
import { TYPES } from "../internal/domain/types";
import { Migrator } from "@migrations";
import { Postgres } from "../internal/adapters/store";
import { CONFIG } from "../deploy";

dotenv.config({
  path: process.cwd() + "/src/deploy/env/.env"
});

export async function bootstrap() {
    const logger = DI.get<Logger>(TYPES.Logger);
  try {
    const cfg = DI.get<CONFIG>(TYPES.APP_CONFIG);

    if (cfg.runMigration) {
      await DI.get<Migrator>(TYPES.Migrator).execMigrations(DI.get<Postgres>(TYPES.Postgres));
    }

    DI.get<HttpServer>(TYPES.HttpServer).listen();
  } catch (e) {
    logger.print(PREFIXES.SERVE, e as Error, (e as Error).message);
  }
}
