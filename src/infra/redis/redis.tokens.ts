/**
 * Redis Module Dependency Injection Tokens
 */

export const REDIS_TOKENS = {
  REDIS_CLIENT: 'REDIS_CLIENT',
  REDIS_SERVICE: 'REDIS_SERVICE',
  REDIS_CLUSTER: 'REDIS_CLUSTER',
} as const;

export type RedisToken = keyof typeof REDIS_TOKENS;
