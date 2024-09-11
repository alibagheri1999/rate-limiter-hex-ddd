import { IUserService, IUserRepository, ICacheRepository } from "../../../ports";
import { CONFIG } from "../../../../deploy";
import { inject, injectable } from "inversify";
import { REPOSITORY_RESULT, TYPES } from "../../../domain/types";
import { User } from "../../../domain/model";
import { getRandomPhoneNumber } from "../../utils";
import * as cache from "../../../adapters/cache";
import { Logger } from "../../utils/log";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private pgUserRepo: IUserRepository,
    @inject(TYPES.CacheRepository) private redisCacheRepo: ICacheRepository,
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG
  ) {
  }

  async getRandomUser(): Promise<User> {
    let user: REPOSITORY_RESULT<User>

    const phoneNumber = getRandomPhoneNumber();
    const userKey = `user-${phoneNumber}`
    user = await this.redisCacheRepo.get(userKey)
    if (user) return user.rows[0]
    user = await this.pgUserRepo.findUser(phoneNumber);
    await this.redisCacheRepo.set(userKey, user)
    if (!user?.success) throw new Error("Something went wrong");
    if (!user?.rowCount) throw new Error("User not found");
    return user.rows[0];
  }
}
