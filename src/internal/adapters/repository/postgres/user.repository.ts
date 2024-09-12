import * as store from "../../store";
import { IUserRepository } from "../../../ports";
import { UserEntity } from "../../../domain/entity";
import { User } from "../../../domain/model";
import { RepositoryResult, TYPES } from "../../../domain/types";
import { inject, injectable } from "inversify";

@injectable()
export class PgUserRepository implements IUserRepository {
  constructor(@inject(TYPES.Postgres) private store: store.Postgres) {}

  async findUser(phoneNumber: string): Promise<RepositoryResult<User>> {
    try {
      const query = "select * from users where phone_number=$1";
      const queryResult = await this.store.client.query<UserEntity>(query, [phoneNumber]);
      const convertedResult: User[] = [];
      if (queryResult.rowCount) {
        convertedResult.push(UserEntity.Create(queryResult.rows[0]).mapToModel());
      }
      return {
        rows: convertedResult,
        rowCount: queryResult.rowCount,
        success: true
      };
    } catch (e) {
      throw e;
    }
  }
}
