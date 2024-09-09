import { REPOSITORY_RESULT } from "../domain/types";
import { UserEntity } from "../domain/entity";

export interface IBaseRepository<T> {
  insertOne(): any;

  updateOne(id: string, userEntity: UserEntity): Promise<REPOSITORY_RESULT<T>>;

  findOne(): any;

  deleteOne(): any;
}
