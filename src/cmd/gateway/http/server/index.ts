import express, { Response } from "express";
import http from "http";
import { Middlewares, Router, UserRoutes } from "../../index";
import { CONFIG } from "../../../../deploy";
import { Logger, PREFIXES } from "../../../../internal/application/utils/log";
import { inject, injectable } from "inversify";
import { HttpStatusCode, TYPES } from "../../../../internal/domain/types";
import { HttpRoutes } from "../../../../internal/domain/types/httpRoutes";
import { ExpressRequest } from "../../../../internal/domain/types/expressRequest";
import { ApiResponse } from "../../../../internal/domain/types/globalResponse";
import { HttpStatusMessage } from "../../../../internal/domain/types/httpStatusMessage";
import { ExpressError } from "../../../../internal/domain/types/expressError";

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
        .use((_: ExpressRequest, res: Response, next: express.NextFunction) => {
          const response: ApiResponse<null> = {
            success: false,
            message: HttpStatusMessage.NOT_FOUND,
            error: "API_NOT_FOUND"
          };
          res.status(HttpStatusCode.NOT_FOUND).json(response);
        })
        .use(
          (
            error: ExpressError,
            _: express.Request,
            res: express.Response,
            next: express.NextFunction
          ) => {
            const response: ApiResponse<null> = {
              success: false,
              message: HttpStatusMessage.INTERNAL_SERVER_ERROR,
              error: error.message
            };
            res
              .status(error?.status ? error.status : HttpStatusCode.INTERNAL_SERVER_ERROR)
              .json(response);
          }
        )
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
