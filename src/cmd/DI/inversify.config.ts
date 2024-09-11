import { Container } from "inversify";
import { TYPES } from "../../internal/domain/types";
import { APP_CONFIG, CONFIG } from "../../deploy";
import { DocGenerator } from "../doc";
import { Postgres } from "../../internal/adapters/store";
import { Migrator } from "@migrations";
import { HttpServer, Middlewares, Router, UserController, UserRoutes } from "../gateway";
import { PgUserRepository } from "../../internal/adapters/repository";
import { IUserController, IUserService, IUserRepository } from "../../internal/ports";
import { UserService } from "../../internal/application/services";
import { Logger } from "../../internal/application/utils/log";
import { Redis } from "../../internal/adapters/cache";
import { ICacheRepository } from "../../internal/ports";
import { RedisCacheRepository } from "../../internal/adapters/repository/redis/cache.repository";

const DI = new Container();

// dependency injections
DI.bind<CONFIG>(TYPES.APP_CONFIG).toConstantValue(APP_CONFIG);
DI.bind<DocGenerator>(TYPES.DocGenerator).to(DocGenerator);
DI.bind<Redis>(TYPES.Redis).to(Redis).inSingletonScope();
DI.bind<Postgres>(TYPES.Postgres).to(Postgres).inSingletonScope();
DI.bind<Migrator>(TYPES.Migrator).to(Migrator).inSingletonScope();

DI.bind<UserRoutes>(TYPES.UserRoutes).to(UserRoutes).inSingletonScope();

DI.bind<Router>(TYPES.UserRouter).to(Router).inSingletonScope();
DI.bind<Router>(TYPES.RootRouter).to(Router).inSingletonScope();

DI.bind<IUserRepository>(TYPES.UserRepository).to(PgUserRepository).inSingletonScope();
DI.bind<ICacheRepository>(TYPES.CacheRepository).to(RedisCacheRepository).inSingletonScope();

DI.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();

DI.bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();

DI.bind<HttpServer>(TYPES.HttpServer).to(HttpServer).inSingletonScope();

DI.bind<Middlewares>(TYPES.Middlewares).to(Middlewares).inSingletonScope();
DI.bind<Logger>(TYPES.Logger).to(Logger).inSingletonScope();

export { DI };
