import { Injectable, Inject, Logger } from '@nestjs/common';
import Redlock from 'redlock';
import { IRedlockService } from '../interfaces/redlock.interface';
import { REDLOCK_TOKENS } from '../redlock.tokens';

@Injectable()
export class RedlockService implements IRedlockService {
  private readonly logger = new Logger(RedlockService.name);

  constructor(
    @Inject(REDLOCK_TOKENS.REDLOCK_INSTANCE) private readonly redlock: Redlock,
  ) {}

  async executeWithLock<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>,
  ): Promise<T> {
    const lockKey = `lock:${key}`;
    let lock: any;

    try {
      this.logger.debug(`Acquiring lock for key: ${lockKey}`);
      lock = await this.redlock.acquire([lockKey], ttl);
      this.logger.debug(`Lock acquired for key: ${lockKey}`);

      const result = await callback();

      this.logger.debug(`Callback executed successfully for key: ${lockKey}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Error during lock execution for key ${lockKey}:`,
        error,
      );
      throw error;
    } finally {
      if (lock) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          await lock.release();
          this.logger.debug(`Lock released for key: ${lockKey}`);
        } catch (releaseError) {
          this.logger.warn(
            `Failed to release lock for key ${lockKey}:`,
            releaseError,
          );
        }
      }
    }
  }

  async acquireLock(keys: string[], ttl: number): Promise<any> {
    try {
      const lockKeys = keys.map((key) => `lock:${key}`);
      this.logger.debug(`Acquiring locks for keys: ${lockKeys.join(', ')}`);

      const lock = await this.redlock.acquire(lockKeys, ttl);
      this.logger.debug(`Locks acquired for keys: ${lockKeys.join(', ')}`);

      return lock;
    } catch (error) {
      this.logger.error(
        `Failed to acquire locks for keys: ${keys.join(', ')}`,
        error,
      );
      throw error;
    }
  }

  async releaseLock(lock: any): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await lock.release();
      this.logger.debug('Lock released successfully');
    } catch (error) {
      this.logger.error('Failed to release lock:', error);
      throw error;
    }
  }
}
