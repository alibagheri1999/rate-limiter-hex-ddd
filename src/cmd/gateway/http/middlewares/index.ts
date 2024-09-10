import express from "express";
import helmet from "helmet";
import cors from "cors";
import { APP_CONFIG, CONFIG } from "../../../../deploy";
import expressWinston from "express-winston";
import winston from "winston";
import { Router } from "../router";
import { Logger, PREFIXES } from "../../../../internal/application/utils/log";
import swaggerUi from "swagger-ui-express";
import { DocGenerator } from "../../../doc";
import { inject, injectable } from "inversify";
import { HTTP_STATUS_MESSAGE, TYPES } from "../../../../internal/domain/types";
import rateLimit from "express-rate-limit";
import { messageToClient } from "../../../../internal/application/utils";
import i18next from "i18next";
import fsI18Next from "i18next-node-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";
import path from "path";

@injectable()
export class Middlewares {
  constructor(
    @inject(TYPES.RootRouter) private router: Router,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG,
    @inject(TYPES.DocGenerator) private docGenerator: DocGenerator,
    @inject(TYPES.Logger) private logger: Logger
  ) {
  }

  async registerMiddlewares() {
    const expressRouter = this.router.getRouter();

    const limiter = rateLimit({
      windowMs: this.cfg.rateLimitTime * 60 * 1000,
      max: this.cfg.maxRateLimit,
      standardHeaders: true,
      legacyHeaders: false,
      message: messageToClient(
        false,
        "Too many requests please try later",
        HTTP_STATUS_MESSAGE.TOO_MANY_REQUESTS,
        {
          message: "Too many requests please try later"
        }
      )
    });

    expressRouter.use(limiter);
    expressRouter.use(express.json());

    await i18next
      .use(fsI18Next)
      .use(i18nextMiddleware.LanguageDetector)
      .init({
        backend: {
          loadPath: path.resolve("src", "locales") + "/{{lng}}/{{ns}}.json"
        },
        fallbackLng: "en",
        preload: ["en", "es"]
      });

    expressRouter.use(i18nextMiddleware.handle(i18next));

    const winstonLogger = expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(winston.format.colorize(), winston.format.json()),
      level: "info",
      meta: false,
      msg: APP_CONFIG.logFormat,
      expressFormat: true,
      colorize: true,
      ignoreRoute: function() {
        return false;
      }
    });

    expressRouter.use((req, res, next) => {
      winstonLogger(req, res, next);
    });

    expressRouter.use(express.urlencoded({ extended: true }));

    this.logger.print(
      PREFIXES.HTTP_SERVER,
      null,
      `static folder path : ${APP_CONFIG.staticFolder}`
    );

    expressRouter.use(
      helmet({
        contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false
      })
    );
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
