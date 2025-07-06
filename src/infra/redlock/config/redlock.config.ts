import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Injectable()
export class RedLockConfig {
  private readonly redisCluster: Redis[] = [
    new Redis(7000),
    new Redis(7001),
    new Redis(7002),
  ];

  private readonly redLock: Redlock;

  constructor() {
    if (this.redLock == undefined) {
      this.redLock = new Redlock(this.redisCluster, {
        driftFactor: 0.01, // time in ms
        retryCount: 10,
        retryDelay: 200, // time in ms
        retryJitter: 200, // time in ms
      });
    }
  }
  getRedLock(): Redlock {
    return this.redLock;
  }
}
