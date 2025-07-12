import Redlock from 'redlock';

export interface IRedlockService {
  executeWithLock<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<T>;
  acquireLock(keys: string[], ttl: number): Promise<any>;
  releaseLock(lock: any): Promise<void>;
}

export interface IRedlockConfig {
  getRedlock(): Redlock;
  isHealthy(): Promise<boolean>;
}
