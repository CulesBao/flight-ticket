/**
 * Passengers Module Dependency Injection Tokens
 */

export const PASSENGER_TOKENS = {
  // Repository
  PASSENGER_REPOSITORY: 'PASSENGER_REPOSITORY',

  // Use Cases
  CREATE_PASSENGER_USE_CASE: 'CREATE_PASSENGER_USE_CASE',
  GET_PASSENGER_BY_ID_USE_CASE: 'GET_PASSENGER_BY_ID_USE_CASE',
  UPDATE_PASSENGER_USE_CASE: 'UPDATE_PASSENGER_USE_CASE',
} as const;

export type PassengerToken = keyof typeof PASSENGER_TOKENS;
