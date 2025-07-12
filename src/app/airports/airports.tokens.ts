/**
 * Airport Module Dependency Injection Tokens
 */

export const AIRPORT_TOKENS = {
  // Repository
  AIRPORT_REPOSITORY: 'AIRPORT_REPOSITORY',

  // Use Cases
  GET_AIRPORT_BY_CODE_USE_CASE: 'GET_AIRPORT_BY_CODE_USE_CASE',
  GET_ALL_AIRPORTS_USE_CASE: 'GET_ALL_AIRPORTS_USE_CASE',
} as const;

export type AirportToken = keyof typeof AIRPORT_TOKENS;
