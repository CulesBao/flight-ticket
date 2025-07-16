export const REDIS_TOKENS = {
  REDIS_CLUSTER: 'REDIS_CLUSTER',
  REDIS_CLIENT: 'REDIS_CLIENT',
  REDIS_SERVICE: 'REDIS_SERVICE',
} as const;

export type RedisToken = keyof typeof REDIS_TOKENS;
