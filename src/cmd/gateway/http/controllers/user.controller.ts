import { IUserController, IUserService } from "../../../../internal/ports";
import { NextFunction, Request, Response } from "express";
import { CONFIG } from "../../../../deploy";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../internal/domain/types";
import { User } from "../../../../internal/domain/model";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG
  ) {}

  static Setup(userService: IUserService, cfg: CONFIG): UserController {
    return new UserController(userService, cfg);
  }

  async getRandomUser(req: Request, res: Response): Promise<User> {
    return await this.userService.getRandomUser()
  }
}
