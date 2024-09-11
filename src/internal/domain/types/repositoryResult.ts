export type RepositoryResult<T> = {
  rows: T[];
  rowCount: number;
  success: Boolean;
};
