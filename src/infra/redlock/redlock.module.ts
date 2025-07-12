import { Module } from '@nestjs/common';
import { RedlockConfig } from './config/redlock.config';
import { RedlockService } from './service/redlock.service';
import { RedisModule } from '../redis/redis.module';
import { REDIS_TOKENS } from '../redis/redis.tokens';
import { REDLOCK_TOKENS } from './redlock.tokens';
@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: REDLOCK_TOKENS.REDLOCK_INSTANCE,
      useFactory: (redlockConfig: RedlockConfig) => {
        return redlockConfig.getRedlock();
      },
      inject: [REDIS_TOKENS.REDIS_CLUSTER],
    },
    {
      provide: REDIS_TOKENS.REDIS_CLUSTER,
      useFactory: async () => {
        const { RedisClusterConfig } = await import(
          '../redis/config/redis-cluster.config'
        );
        return new RedisClusterConfig();
      },
    },
    RedlockConfig,
    {
      provide: REDLOCK_TOKENS.REDLOCK_SERVICE,
      useClass: RedlockService,
    },
    RedlockService,
  ],
  exports: [
    REDLOCK_TOKENS.REDLOCK_INSTANCE,
    REDLOCK_TOKENS.REDLOCK_SERVICE,
    RedlockService,
    RedlockConfig,
  ],
})
export class RedlockModule {}
