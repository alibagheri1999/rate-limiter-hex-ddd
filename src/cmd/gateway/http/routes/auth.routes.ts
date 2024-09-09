import { IAuthController, IRoutes } from "../../../../internal/ports";
import { Router } from "../../index";
import { CONFIG } from "../../../../deploy";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../internal/domain/types";

@injectable()
export class AuthRoutes implements IRoutes {
  constructor(
    @inject(TYPES.AuthController) private authController: IAuthController,
    @inject(TYPES.AuthRouter) public router: Router,
    @inject(TYPES.AuthRepository) private cfg: CONFIG
  ) {}

  registerRoutes(): Router {
    const expressRouter = this.router.getRouter();

    expressRouter.get<string, any, string>("/", this.authController.verifyToken);
    expressRouter.get("/sms-verification", this.authController.smsVerification);

    return this.router;
  }
}
