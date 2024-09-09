import { Container } from "inversify";
import { TYPES } from "../../internal/domain/types";
import { APP_CONFIG, CONFIG } from "../../deploy";
import { DocGenerator } from "../doc";
import { Postgres } from "../../internal/adapters/store";
import { Migrator } from "@migrations";
import {
  AuthController,
  AuthRoutes,
  HttpServer,
  Middlewares,
  Router,
  UserController,
  UserRoutes
} from "../gateway";
import { PgAuthRepository, PgUserRepository } from "../../internal/adapters/repository";
import {
  IAuthController,
  IAuthInteractor,
  IAuthRepository,
  IUserController,
  IUserInteractor,
  IUserRepository
} from "../../internal/ports";
import { AuthInteractor, UserInteractor } from "../../internal/application/services";
import { Logger } from "../../internal/application/utils/log";

const DI = new Container();

// dependency injections
DI.bind<CONFIG>(TYPES.APP_CONFIG).toConstantValue(APP_CONFIG);
DI.bind<DocGenerator>(TYPES.DocGenerator).to(DocGenerator);
DI.bind<Postgres>(TYPES.Postgres).to(Postgres).inSingletonScope();
DI.bind<Migrator>(TYPES.Migrator).to(Migrator).inSingletonScope();

DI.bind<UserRoutes>(TYPES.UserRoutes).to(UserRoutes).inSingletonScope();
DI.bind<AuthRoutes>(TYPES.AuthRoutes).to(AuthRoutes).inSingletonScope();

DI.bind<Router>(TYPES.UserRouter).to(Router).inSingletonScope();
DI.bind<Router>(TYPES.AuthRouter).to(Router).inSingletonScope();
DI.bind<Router>(TYPES.RootRouter).to(Router).inSingletonScope();

DI.bind<IUserRepository>(TYPES.UserRepository).to(PgUserRepository).inSingletonScope();
DI.bind<IAuthRepository>(TYPES.AuthRepository).to(PgAuthRepository).inSingletonScope();

DI.bind<IUserInteractor>(TYPES.UserInteractor).to(UserInteractor).inSingletonScope();
DI.bind<IAuthInteractor>(TYPES.AuthInteractor).to(AuthInteractor).inSingletonScope();

DI.bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
DI.bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();

DI.bind<HttpServer>(TYPES.HttpServer).to(HttpServer).inSingletonScope();

DI.bind<Middlewares>(TYPES.Middlewares).to(Middlewares).inSingletonScope();
DI.bind<Logger>(TYPES.Logger).to(Logger).inSingletonScope();

export { DI };
