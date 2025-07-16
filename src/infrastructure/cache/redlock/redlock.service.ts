import { Injectable, Logger, Inject } from '@nestjs/common';
import Redlock, { Lock, RedlockAbortSignal } from 'redlock';
import { Cluster } from 'ioredis';
import { REDIS_TOKENS } from '../redis/redis.tokens';

@Injectable()
export class RedlockService {
  private readonly logger = new Logger(RedlockService.name);
  private redlock: Redlock;

  constructor(
    @Inject(REDIS_TOKENS.REDIS_CLUSTER)
    private readonly redisCluster: any,
  ) {
    this.initializeRedlock();
  }

  private initializeRedlock() {
    // Get all Redis nodes from cluster
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const cluster = this.redisCluster.getCluster() as Cluster;
    const nodes = cluster.nodes('all');

    this.redlock = new Redlock(nodes, {
      driftFactor: 0.01,
      retryCount: 10,
      retryDelay: 200,
      retryJitter: 200,
      automaticExtensionThreshold: 500,
    });

    this.redlock.on('clientError', (err) => {
      this.logger.error('A redis error has occurred:', err);
    });

    this.logger.log('Redlock initialized with Redis cluster');
  }

  async acquire(resource: string | string[], ttl: number): Promise<Lock> {
    try {
      const lock = await this.redlock.acquire(
        Array.isArray(resource) ? resource : [resource],
        ttl,
      );

      this.logger.debug(
        `Lock acquired for resource: ${JSON.stringify(resource)}`,
      );
      return lock;
    } catch (error) {
      this.logger.error(
        `Failed to acquire lock for resource: ${JSON.stringify(resource)}`,
        error,
      );
      throw error;
    }
  }
  async using<T>(
    resource: string | string[],
    ttl: number,
    routine: (signal: RedlockAbortSignal) => Promise<T>,
  ): Promise<T> {
    try {
      this.logger.debug(
        `Executing with lock for resource: ${JSON.stringify(resource)}`,
      );

      return await this.redlock.using(
        Array.isArray(resource) ? resource : [resource],
        ttl,
        routine,
      );
    } catch (error) {
      this.logger.error(
        `Failed to execute with lock for resource: ${JSON.stringify(resource)}`,
        error,
      );
      throw error;
    }
  }
}
