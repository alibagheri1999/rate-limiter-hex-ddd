import { IUserController, IUserService } from "../../../../internal/ports";
import { Request } from "express";
import { inject, injectable } from "inversify";
import { HttpStatusCode, TYPES } from "../../../../internal/domain/types";
import { ExpressResponse } from "../../../../internal/domain/types/expressResponse";
import { Logger, PREFIXES } from "../../../../internal/application/utils/log";
import { getRandomPhoneNumber } from "../../../../internal/application/utils";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  getRandomUser = async (_: Request, res: ExpressResponse) => {
    try {
      const phoneNumber = getRandomPhoneNumber();
      const user = await this.userService.getRandomUser(phoneNumber);
      this.logger.print(PREFIXES.TRACING, null, "GET_RANDOM_USER_DATA", user);
      return res.success(HttpStatusCode.OK, user, "GET_RANDOM_USER");
    } catch (e: any) {
      return res.error(HttpStatusCode.BAD_REQUEST, e.message, e);
    }
  };
}
