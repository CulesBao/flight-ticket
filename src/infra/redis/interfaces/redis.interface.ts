import Redis from 'ioredis';

export interface IRedisService {
  set(key: string, value: string, ttl?: number): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  setex(key: string, seconds: number, value: string): Promise<void>;
  expire(key: string, seconds: number): Promise<boolean>;
  hset(key: string, field: string, value: string): Promise<void>;
  hget(key: string, field: string): Promise<string | null>;
  hdel(key: string, field: string): Promise<void>;
}

export interface IRedisCluster {
  getClient(index: number): Redis;
  getAllClients(): Redis[];
  isHealthy(): Promise<boolean>;
}
