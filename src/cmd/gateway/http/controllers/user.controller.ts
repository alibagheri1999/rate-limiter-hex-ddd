import { IUserController, IUserService } from "../../../../internal/ports";
import { Request } from "express";
import { CONFIG } from "../../../../deploy";
import { inject, injectable } from "inversify";
import { HttpStatusCode, TYPES } from "../../../../internal/domain/types";
import { ExpressResponse } from "../../../../internal/domain/types/expressResponse";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG
  ) {}

  static Setup(userService: IUserService, cfg: CONFIG): UserController {
    return new UserController(userService, cfg);
  }

  getRandomUser = async (_: Request, res: ExpressResponse) => {
    try {
      const user = await this.userService.getRandomUser();
      return res.success(HttpStatusCode.OK, user, "GET_RANDOM_USER");
    } catch (e: any) {
      return res.error(HttpStatusCode.BAD_REQUEST, e.message, e);
    }
  };
}
