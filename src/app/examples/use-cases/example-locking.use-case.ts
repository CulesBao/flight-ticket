import { Injectable, Inject } from '@nestjs/common';
import { RedlockService } from 'src/infra/redlock/service/redlock.service';
import { RedisService } from 'src/infra/redis/redis.service';

@Injectable()
export class ExampleLockingUseCase {
  constructor(
    @Inject('REDLOCK_SERVICE') private readonly redlockService: RedlockService,
    @Inject('REDIS_SERVICE') private readonly redisService: RedisService,
  ) {}

  async reserveSeatWithLock(seatId: string, userId: string): Promise<boolean> {
    const lockKey = `seat:${seatId}`;
    const lockTTL = 5000; // 5 seconds

    return await this.redlockService.executeWithLock(
      lockKey,
      lockTTL,
      async () => {
        // Kiểm tra ghế có available không
        const seatStatus = await this.redisService.get(`seat:${seatId}:status`);

        if (seatStatus !== 'available') {
          throw new Error('Seat is not available');
        }

        // Reserve ghế
        await this.redisService.set(`seat:${seatId}:status`, 'reserved');
        await this.redisService.set(`seat:${seatId}:user`, userId);

        return true;
      },
    );
  }

  // Ví dụ sử dụng manual lock
  async manualLockExample(resourceId: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const lock: Promise<any> = await this.redlockService.acquireLock(
      [resourceId],
      3000,
    );

    try {
      // Thực hiện business logic
      await this.redisService.set(`resource:${resourceId}`, 'processing');

      // Simulate some work
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await this.redisService.set(`resource:${resourceId}`, 'completed');
    } finally {
      await this.redlockService.releaseLock(lock);
    }
  }
}
