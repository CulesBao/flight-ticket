import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { IRedisService } from './interfaces/redis.interface';
import { REDIS_TOKENS } from './redis.tokens';

@Injectable()
export class RedisService implements IRedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @Inject(REDIS_TOKENS.REDIS_CLIENT) private readonly redisClient: Redis,
  ) {}

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.redisClient.setex(key, ttl, value);
      } else {
        await this.redisClient.set(key, value);
      }
      this.logger.debug(`Set key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to set key ${key}:`, error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const result = await this.redisClient.get(key);
      this.logger.debug(
        `Get key: ${key}, result: ${result ? 'found' : 'not found'}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Failed to get key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redisClient.del(key);
      this.logger.debug(`Deleted key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redisClient.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to check existence of key ${key}:`, error);
      throw error;
    }
  }

  async setex(key: string, seconds: number, value: string): Promise<void> {
    try {
      await this.redisClient.setex(key, seconds, value);
      this.logger.debug(`Set key with expiry: ${key}, ttl: ${seconds}s`);
    } catch (error) {
      this.logger.error(`Failed to setex key ${key}:`, error);
      throw error;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.redisClient.expire(key, seconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Failed to set expiry for key ${key}:`, error);
      throw error;
    }
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    try {
      await this.redisClient.hset(key, field, value);
      this.logger.debug(`Hash set: ${key}.${field}`);
    } catch (error) {
      this.logger.error(`Failed to hset ${key}.${field}:`, error);
      throw error;
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    try {
      const result = await this.redisClient.hget(key, field);
      this.logger.debug(
        `Hash get: ${key}.${field}, result: ${result ? 'found' : 'not found'}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Failed to hget ${key}.${field}:`, error);
      throw error;
    }
  }

  async hdel(key: string, field: string): Promise<void> {
    try {
      await this.redisClient.hdel(key, field);
      this.logger.debug(`Hash deleted: ${key}.${field}`);
    } catch (error) {
      this.logger.error(`Failed to hdel ${key}.${field}:`, error);
      throw error;
    }
  }
}
