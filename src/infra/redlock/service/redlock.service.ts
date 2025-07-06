import { Inject, Injectable } from '@nestjs/common';
import Redlock from 'redlock';

@Injectable()
export class RedlockService {
  constructor(
    @Inject('REDLOCK_INSTANCE') private readonly redlockInstance: Redlock,
  ) {}

  async excuteWithLock(
    key: string,
    ttl: number,
    callback: () => Promise<void>,
  ): Promise<void> {
    const lock = await this.redlockInstance.acquire([key], ttl);
    try {
      await callback();
    } finally {
      await lock.release();
    }
  }
}
