export const AIRPORT_TOKENS = {
  // Repository
  AIRPORT_REPOSITORY: 'AIRPORT_REPOSITORY',

  // Services
  AIRPORT_SERVICE: 'AIRPORT_SERVICE',
} as const;

export type AirportToken = keyof typeof AIRPORT_TOKENS;
