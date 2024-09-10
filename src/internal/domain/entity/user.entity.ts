import { User } from "../model";

new Date().toISOString();

export class UserEntity {
  constructor(
    public id: string,
    public phone_number: string,
    public username: string,
    public created_on: string,
    public updated_on: string
  ) {}

  static Create(queryResult: UserEntity): UserEntity {
    return new UserEntity(
      queryResult.id,
      queryResult.phone_number,
      queryResult.username,
      queryResult.created_on,
      queryResult.updated_on
    );
  }

  mapToModel(): User {
    return new User(
      this.id,
      this.phone_number,
      this.username,
      new Date(this.created_on),
      new Date(this.updated_on)
    );
  }
}
