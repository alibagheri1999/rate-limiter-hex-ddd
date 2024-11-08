import express from "express";
import { injectable } from "inversify";
import { IRouter } from "../../../../internal/ports";

@injectable()
export class Router implements IRouter {
  public router: express.Router;

  constructor() {
    this.router = express.Router();

    this.router.use(express.json());
    this.router.use(express.urlencoded({ extended: true }));
  }

  getRouter = (): express.Router => this.router;
}
