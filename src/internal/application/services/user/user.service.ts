import { ICacheRepository, IUserRepository, IUserService } from "../../../ports";
import { CONFIG } from "../../../../deploy";
import { inject, injectable } from "inversify";
import { RepositoryResult, TYPES } from "../../../domain/types";
import { User } from "../../../domain/model";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private pgUserRepo: IUserRepository,
    @inject(TYPES.CacheRepository) private redisCacheRepo: ICacheRepository,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG
  ) {}

  async getRandomUser(phoneNumber: string): Promise<User> {
    const userKey = `user-${phoneNumber}`;
    const existingUser = await this.redisCacheRepo.get(userKey);
    if (existingUser) return JSON.parse(existingUser).rows[0];
    const user: RepositoryResult<User> = await this.pgUserRepo.findUser(phoneNumber);
    if (!user?.rowCount) throw new Error("User not found");
    if (!user?.success) throw new Error("Something went wrong");
    await this.redisCacheRepo.setWithTimeout(userKey, JSON.stringify(user), this.cfg.cacheDuration);
    return user.rows[0];
  }
}
