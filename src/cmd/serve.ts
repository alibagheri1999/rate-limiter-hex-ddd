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

dotenv.config({
  path: process.cwd() + "/src/deploy/env/.env"
});
const logger = DI.get<Logger>(TYPES.Logger);

export async function bootstrap() {
  // await DI.get<Redis>(TYPES.Redis).connect();

  try {
    await DI.get<Migrator>(TYPES.Migrator).createDatabase();
  } catch (e) {
    logger.print(PREFIXES.SERVE, e as Error, "error occurred while creating database", e);
  }

  try {
    await DI.get<Migrator>(TYPES.Migrator).execMigrations(DI.get<Postgres>(TYPES.Postgres));

    DI.get<HttpServer>(TYPES.HttpServer).listen();

  } catch (e) {
    logger.print(PREFIXES.SERVE, e as Error, (e as Error).message);
  }
}
