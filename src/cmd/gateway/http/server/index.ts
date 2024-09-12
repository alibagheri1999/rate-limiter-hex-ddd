import express from "express";
import http from "http";
import { Middlewares, Router, UserRoutes } from "../../index";
import { CONFIG } from "../../../../deploy";
import { Logger, PREFIXES } from "../../../../internal/application/utils/log";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../internal/domain/types";
import { HttpRoutes } from "../../../../internal/domain/types/httpRoutes";
import { errorMiddleware, globalMiddleware } from "../middlewares/error.middleware";

@injectable()
export class HttpServer {
  server: http.Server | null = null;

  constructor(
    @inject(TYPES.UserRoutes) private userRoutes: UserRoutes,
    @inject(TYPES.RootRouter) private rootRouter: Router,
    @inject(TYPES.Middlewares) private middlewares: Middlewares,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG,
    @inject(TYPES.Logger) private logger: Logger
  ) {
    userRoutes.registerRoutes();
    middlewares.registerMiddlewares().then().catch();
    this.server = http.createServer(
      express()
        .use(HttpRoutes.ROOT_PREFIX, this.rootRouter.getRouter())
        .use(HttpRoutes.USER_PREFIX, this.userRoutes.router.getRouter())
        .use(globalMiddleware)
        .use(errorMiddleware)
    );
  }

  getServer(): http.Server | null {
    return this.server;
  }

  listen() {
    this.server?.listen(this.cfg.httpServerPort, () => {
      this.logger.print(PREFIXES.HTTP_SERVER, null, "server is running " + this.cfg.httpServerPort);
    });
  }
}
