export interface ICacheRepository {
  get(key: string): Promise<any | null>
  delete(key: string): Promise<void>
  set(key: string, value: any): Promise<void>
  setRateWithTimeout(key: string, value: any): Promise<void>
  setWithTimeout(key: string, value: any, time: number): Promise<void>
}
