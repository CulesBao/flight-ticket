export interface RedisClusterNode {
  host: string;
  port: number;
}

export interface RedisClusterOptions {
  nodes: RedisClusterNode[];
  password?: string;
  enableReadyCheck?: boolean;
  redisOptions?: {
    connectTimeout?: number;
    lazyConnect?: boolean;
    maxRetriesPerRequest?: number;
  };
}
