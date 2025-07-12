import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redlock from 'redlock';
import { IRedlockConfig } from '../interfaces/redlock.interface';
import { RedisClusterConfig } from '../../redis/config/redis-cluster.config';
import { REDIS_TOKENS } from '../../redis/redis.tokens';

@Injectable()
export class RedlockConfig implements IRedlockConfig, OnModuleDestroy {
  private readonly logger = new Logger(RedlockConfig.name);
  private readonly redlock: Redlock;

  constructor(
    @Inject(REDIS_TOKENS.REDIS_CLUSTER)
    private readonly redisCluster: RedisClusterConfig,
  ) {
    this.redlock = this.initializeRedlock();
  }

  private initializeRedlock(): Redlock {
    try {
      const clients = this.redisCluster.getAllClients();

      if (clients.length === 0) {
        throw new Error('No Redis clients available for Redlock');
      }

      const redlock = new Redlock(clients, {
        driftFactor: 0.01, // Expected clock drift in ms
        retryCount: 10, // Number of retry attempts
        retryDelay: 200, // Time in ms between retry attempts
        retryJitter: 200, // Random jitter in ms added to retry delay
        automaticExtensionThreshold: 500, // Extend locks automatically
      });

      redlock.on('clientError', (err, stats) => {
        this.logger.error('Redlock client error:', err);
        this.logger.debug('Redlock stats:', stats);
      });

      this.logger.log('Redlock initialized successfully');
      return redlock;
    } catch (error) {
      this.logger.error('Failed to initialize Redlock:', error);
      throw error;
    }
  }

  getRedlock(): Redlock {
    return this.redlock;
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Test với một lock nhỏ
      const testKey = `healthcheck:${Date.now()}`;
      const lock = await this.redlock.acquire([testKey], 1000);
      await lock.release();
      return true;
    } catch (error) {
      this.logger.warn('Redlock health check failed:', error);
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.redlock.quit();
      this.logger.log('Redlock disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting Redlock:', error);
    }
  }
}
