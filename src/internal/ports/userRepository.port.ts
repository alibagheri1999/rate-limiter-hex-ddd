import { IBaseRepository } from "./index";
import { RepositoryResult } from "../domain/types";
import { User } from "../domain/model";

export interface IUserRepository extends IBaseRepository<User> {
  findUser(phoneNumber: string): Promise<RepositoryResult<User>>;
}
