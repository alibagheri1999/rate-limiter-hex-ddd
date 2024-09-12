import { User } from "../domain/model";

export interface IUserService {
  getRandomUser(phoneNumber: string): Promise<User>;
}
