export interface ICacheRepository {
  get(key: string): Promise<string | null>;
  delete(key: string): Promise<void>;
  set(key: string, value: string): Promise<void>;
  setWithTimeout(key: string, value: string, time: number): Promise<void>;
}
