import { Injectable, Logger } from '@nestjs/common';
import { Cluster } from 'ioredis';
import { RedisClusterOptions } from './redis.config';

@Injectable()
export class RedisClusterService {
  private readonly logger = new Logger(RedisClusterService.name);
  private cluster: Cluster;

  constructor() {
    this.initializeCluster();
  }

  private initializeCluster() {
    const clusterOptions: RedisClusterOptions = {
      nodes: [
        { host: 'localhost', port: 7000 },
        { host: 'localhost', port: 7001 },
        { host: 'localhost', port: 7002 },
      ],
      enableReadyCheck: true,
      redisOptions: {
        connectTimeout: 10000,
        lazyConnect: true,
        maxRetriesPerRequest: 3,
      },
    };

    this.cluster = new Cluster(clusterOptions.nodes, clusterOptions);

    this.cluster.on('connect', () => {
      this.logger.log('Redis cluster connected');
    });

    this.cluster.on('ready', () => {
      this.logger.log('Redis cluster ready');
    });

    this.cluster.on('error', (error) => {
      this.logger.error('Redis cluster error:', error);
    });

    this.cluster.on('close', () => {
      this.logger.warn('Redis cluster connection closed');
    });

    this.cluster.on('reconnecting', () => {
      this.logger.log('Redis cluster reconnecting...');
    });
  }

  getCluster(): Cluster {
    return this.cluster;
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.cluster.get(key);
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      throw error;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    try {
      if (ttl) {
        return await this.cluster.setex(key, ttl, value);
      }
      return await this.cluster.set(key, value);
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.cluster.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<number> {
    try {
      return await this.cluster.exists(key);
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}:`, error);
      throw error;
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    try {
      return await this.cluster.hget(key, field);
    } catch (error) {
      this.logger.error(
        `Error getting hash field ${field} from key ${key}:`,
        error,
      );
      throw error;
    }
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    try {
      return await this.cluster.hset(key, field, value);
    } catch (error) {
      this.logger.error(
        `Error setting hash field ${field} in key ${key}:`,
        error,
      );
      throw error;
    }
  }

  async expire(key: string, seconds: number): Promise<number> {
    try {
      return await this.cluster.expire(key, seconds);
    } catch (error) {
      this.logger.error(`Error setting expiration for key ${key}:`, error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async disconnect(): Promise<void> {
    try {
      this.cluster.disconnect();
      this.logger.log('Redis cluster disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting from Redis cluster:', error);
    }
  }
}
