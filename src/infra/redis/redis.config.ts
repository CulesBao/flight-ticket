import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisConfig {
  private readonly redisInstance1: Redis;
  private readonly redisInstance2: Redis;
  private readonly redisInstance3: Redis;

  // singleton pattern to ensure only one instance of Redis is created
  private static instance: RedisConfig;

  private constructor() {
    this.redisInstance1 = new Redis(7000);
    this.redisInstance2 = new Redis(7001);
    this.redisInstance3 = new Redis(7002);
  }

  public static getInstance(instanceId: number): Redis {
    if (!RedisConfig.instance) {
      RedisConfig.instance = new RedisConfig();
    }
    switch (instanceId) {
      case 1:
        return RedisConfig.instance.redisInstance1;
      case 2:
        return RedisConfig.instance.redisInstance2;
      case 3:
        return RedisConfig.instance.redisInstance3;
      default:
        throw new Error('Invalid Redis instance ID');
    }
  }
}
