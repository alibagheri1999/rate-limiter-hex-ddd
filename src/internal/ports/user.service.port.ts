import { User } from "../domain/model";

export interface IUserService {
  getRandomUser(): Promise<User>;
}
