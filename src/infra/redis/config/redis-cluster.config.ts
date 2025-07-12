import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { IRedisCluster } from '../interfaces/redis.interface';

@Injectable()
export class RedisClusterConfig implements IRedisCluster, OnModuleDestroy {
  private readonly logger = new Logger(RedisClusterConfig.name);
  private readonly clients: Map<number, Redis> = new Map();

  constructor() {
    this.initializeCluster();
  }

  private initializeCluster(): void {
    const ports = [7000, 7001, 7002];

    ports.forEach((port, index) => {
      try {
        const client = new Redis({
          port,
          host: 'localhost',
          maxRetriesPerRequest: 3,
          lazyConnect: true,
        });

        client.on('connect', () => {
          this.logger.log(
            `Redis client ${index + 1} connected on port ${port}`,
          );
        });

        client.on('error', (error) => {
          this.logger.error(`Redis client ${index + 1} error:`, error);
        });

        this.clients.set(index + 1, client);
      } catch (error) {
        this.logger.error(`Failed to create Redis client ${index + 1}:`, error);
      }
    });
  }

  getClient(index: number): Redis {
    const client = this.clients.get(index);
    if (!client) {
      throw new Error(`Redis client ${index} not found`);
    }
    return client;
  }

  getAllClients(): Redis[] {
    return Array.from(this.clients.values());
  }

  async isHealthy(): Promise<boolean> {
    try {
      const healthChecks = this.getAllClients().map(async (client) => {
        try {
          await client.ping();
          return true;
        } catch {
          return false;
        }
      });

      const results = await Promise.all(healthChecks);
      return results.every((isHealthy) => isHealthy);
    } catch {
      return false;
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Closing Redis connections...');
    const disconnectPromises = this.getAllClients().map((client) =>
      client.disconnect(),
    );
    await Promise.all(disconnectPromises);
    this.logger.log('All Redis connections closed');
  }
}
