import { IBaseRepository } from "./index";
import { REPOSITORY_RESULT } from "../domain/types";
import { User } from "../domain/model";

export interface IUserRepository extends IBaseRepository<User> {
  findUser(phoneNumber: string): Promise<REPOSITORY_RESULT<User>>;
}
