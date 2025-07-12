import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisClusterConfig } from './config/redis-cluster.config';
import { REDIS_TOKENS } from './redis.tokens';

@Module({
  providers: [
    {
      provide: REDIS_TOKENS.REDIS_CLUSTER,
      useClass: RedisClusterConfig,
    },
    {
      provide: REDIS_TOKENS.REDIS_CLIENT,
      useFactory: (clusterConfig: RedisClusterConfig) => {
        // Sử dụng client đầu tiên làm primary client
        return clusterConfig.getClient(1);
      },
      inject: [REDIS_TOKENS.REDIS_CLUSTER],
    },
    {
      provide: REDIS_TOKENS.REDIS_SERVICE,
      useClass: RedisService,
    },
    RedisService,
  ],
  exports: [
    REDIS_TOKENS.REDIS_SERVICE,
    REDIS_TOKENS.REDIS_CLIENT,
    REDIS_TOKENS.REDIS_CLUSTER,
    RedisService,
  ],
})
export class RedisModule {}
