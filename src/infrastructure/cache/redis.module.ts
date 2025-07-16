import { Module } from '@nestjs/common';
import { RedisClusterService, REDIS_TOKENS } from './redis';

@Module({
  providers: [
    {
      provide: REDIS_TOKENS.REDIS_CLUSTER,
      useClass: RedisClusterService,
    },
    {
      provide: REDIS_TOKENS.REDIS_SERVICE,
      useExisting: REDIS_TOKENS.REDIS_CLUSTER,
    },
  ],
  exports: [REDIS_TOKENS.REDIS_CLUSTER, REDIS_TOKENS.REDIS_SERVICE],
})
export class RedisModule {}
