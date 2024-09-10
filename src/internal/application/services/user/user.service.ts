import {  IUserService, IUserRepository } from "../../../ports";
import { CONFIG } from "../../../../deploy";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../domain/types";
import { User } from "../../../domain/model";
import { getRandomPhoneNumber } from "../../utils";
import * as cache from "../../../adapters/cache";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private pgUserRepo: IUserRepository,
    @inject(TYPES.Redis) private cache: cache.Redis,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG
  ) {}

  static Setup(
    pgUserRepo: IUserRepository,
    cache: cache.Redis,
    cfg: CONFIG
  ): UserService {
    return new UserService(pgUserRepo,cache, cfg);
  }

  async getRandomUser(): Promise<User> {
    const phoneNumber = getRandomPhoneNumber()
    const user = await this.pgUserRepo.findUser(phoneNumber);
    if (!user?.success) throw new Error('Something went wrong')
    if (!user?.rowCount) throw new Error('User not found')
    return user.rows[0]
  }
}
