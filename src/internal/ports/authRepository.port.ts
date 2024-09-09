import { IBaseRepository } from "./repository.port";
import { User } from "../domain/model";

export interface IAuthRepository extends IBaseRepository<User> {}
