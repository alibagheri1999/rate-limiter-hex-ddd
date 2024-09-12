import { UserEntity } from "../entity";

export class User {
  constructor(
    public id: number,
    public phoneNumber: string,
    public username: string,
    public createdOn: Date,
    public updatedOn: Date
  ) {}

  mapToEntity(): UserEntity {
    return new UserEntity(
      this.id,
      this.phoneNumber,
      this.username,
      this.createdOn.toISOString(),
      this.updatedOn.toISOString()
    );
  }
}
