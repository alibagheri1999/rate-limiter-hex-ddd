import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { Router } from "../router";
import { Logger, PREFIXES } from "../../../../internal/application/utils/log";
import swaggerUi from "swagger-ui-express";
import { DocGenerator } from "../../../doc";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../internal/domain/types";
import { rateLimiter } from "./rateLimiter.middleware";
import responseHandler from "./responseHandler.middleware";

@injectable()
export class Middlewares {
  constructor(
    @inject(TYPES.RootRouter) private router: Router,
    @inject(TYPES.DocGenerator) private docGenerator: DocGenerator,
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  async registerMiddlewares() {
    const expressRouter = this.router.getRouter();
    const logger = this.logger;
    expressRouter.use(express.json());

    expressRouter.use(
      morgan((tokens: any, req: express.Request, res: express.Response) => {
        logger.print(
          PREFIXES.HTTP_SERVER,
          null,
          "API_CALL",
          [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, "content-length"),
            "-",
            tokens["response-time"](req, res),
            "ms"
          ].join(" ")
        );
        return null;
      })
    );

    expressRouter.use(rateLimiter);

    expressRouter.use(express.urlencoded({ extended: true }));

    expressRouter.use(
      helmet({
        contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false
      })
    );

    expressRouter.use(responseHandler);

    expressRouter.use(
      cors({
        methods: "*",
        origin: "*"
      })
    );

    expressRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(this.docGenerator.doc));
    this.logger.print(PREFIXES.DOC, null, "swagger is now accessible on /docs");
  }
}
