/**
 * Redlock Module Dependency Injection Tokens
 */

export const REDLOCK_TOKENS = {
  REDLOCK_INSTANCE: 'REDLOCK_INSTANCE',
  REDLOCK_SERVICE: 'REDLOCK_SERVICE',
} as const;

export type RedlockToken = keyof typeof REDLOCK_TOKENS;
