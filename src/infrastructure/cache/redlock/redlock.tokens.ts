export const REDLOCK_TOKENS = {
  REDLOCK_SERVICE: 'REDLOCK_SERVICE',
  REDLOCK_CLIENT: 'REDLOCK_CLIENT',
} as const;

export type RedlockToken = keyof typeof REDLOCK_TOKENS;
