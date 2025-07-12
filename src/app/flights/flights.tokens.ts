/**
 * Flights Module Dependency Injection Tokens
 */

export const FLIGHT_TOKENS = {
  // Repository
  FLIGHT_REPOSITORY: 'FLIGHT_REPOSITORY',

  // Use Cases
  GET_FLIGHT_BY_ID_USE_CASE: 'GET_FLIGHT_BY_ID_USE_CASE',
  SEARCH_FLIGHTS_USE_CASE: 'SEARCH_FLIGHTS_USE_CASE',
  GET_AVAILABLE_FLIGHTS_USE_CASE: 'GET_AVAILABLE_FLIGHTS_USE_CASE',
} as const;

export type FlightToken = keyof typeof FLIGHT_TOKENS;
