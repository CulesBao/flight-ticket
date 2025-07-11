// Redis và Redlock DI tokens
export const REDIS_TOKENS = {
  REDIS_CLIENT: 'REDIS_CLIENT',
  REDIS_SERVICE: 'REDIS_SERVICE',
  REDIS_CLUSTER: 'REDIS_CLUSTER',
} as const;

export const REDLOCK_TOKENS = {
  REDLOCK_INSTANCE: 'REDLOCK_INSTANCE',
  REDLOCK_SERVICE: 'REDLOCK_SERVICE',
} as const;
