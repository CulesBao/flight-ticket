import { Module } from '@nestjs/common';
import { RedlockService, REDLOCK_TOKENS } from './redlock';
import { RedisModule } from './redis.module';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: REDLOCK_TOKENS.REDLOCK_SERVICE,
      useClass: RedlockService,
    },
  ],
  exports: [REDLOCK_TOKENS.REDLOCK_SERVICE],
})
export class RedlockModule {}
