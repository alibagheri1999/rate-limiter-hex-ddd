/*
    resolve default defined paths in package.json
*/

import * as dotenv from "dotenv";
import { GrpcServer, HttpServer } from "./gateway";
import { Logger, PREFIXES } from "../internal/application/utils/log";
import { DI } from "./DI";
import { TYPES } from "../internal/domain/types";
import { Migrator } from "@migrations";
import { Postgres } from "../internal/adapters/store";

dotenv.config({
  path: process.cwd() + "/src/env/.env"
});
const logger = DI.get<Logger>(TYPES.Logger);

export async function bootstrap() {
  try {
    await DI.get<Migrator>(TYPES.Migrator).createDatabase();
  } catch (e) {
    logger.print(PREFIXES.SERVE, e as Error, "error occurred while creating database", e);
  }

  try {
    await DI.get<Migrator>(TYPES.Migrator).execMigrations(DI.get<Postgres>(TYPES.Postgres));

    DI.get<HttpServer>(TYPES.HttpServer).listen();

    DI.get<GrpcServer>(TYPES.GrpcServer).listen();
  } catch (e) {
    logger.print(PREFIXES.SERVE, e as Error, (e as Error).message);
  }
}
