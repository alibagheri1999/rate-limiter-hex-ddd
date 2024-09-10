import { IUserController } from "../../../../internal/ports";
import { Router } from "../router";
import { CONFIG } from "../../../../deploy";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../internal/domain/types";

@injectable()
export class UserRoutes {
  constructor(
    @inject(TYPES.UserController) private userController: IUserController,
    @inject(TYPES.UserRouter) public router: Router,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG
  ) {}
  registerRoutes(): Router {
    const expressRouter = this.router.getRouter();

    expressRouter
      .route("/data")
      .get<any, string>(this.userController.getRandomUser)

    return this.router;
  }
}
