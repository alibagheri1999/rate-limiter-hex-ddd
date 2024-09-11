import * as store from "../../store";
import { IUserRepository } from "../../../ports";
import { CONFIG } from "../../../../deploy";
import { UserEntity } from "../../../domain/entity";
import { User } from "../../../domain/model";
import { REPOSITORY_RESULT, TYPES } from "../../../domain/types";
import { inject, injectable } from "inversify";

@injectable()
export class PgUserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.Postgres) private store: store.Postgres,
    @inject(TYPES.APP_CONFIG) private cfg: CONFIG
  ) {
  }


  async findUser(phoneNumber: string): Promise<REPOSITORY_RESULT<User>> {
    try {
      const query = `select *
                     from users
                     where phoneNumber = '${phoneNumber}'`;

      const queryResult = await this.store.client.query(query);
      const convertedResult: User[] = [];

      convertedResult.push(UserEntity.Create(queryResult.rows[0]).mapToModel());

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
