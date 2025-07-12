/**
 * Seats Module Dependency Injection Tokens
 */

export const SEAT_TOKENS = {
  // Repository
  SEAT_REPOSITORY: 'SEAT_REPOSITORY',

  // Use Cases
  GET_SEATS_BY_FLIGHT_USE_CASE: 'GET_SEATS_BY_FLIGHT_USE_CASE',
  RESERVE_SEAT_USE_CASE: 'RESERVE_SEAT_USE_CASE',
  RELEASE_SEAT_USE_CASE: 'RELEASE_SEAT_USE_CASE',
} as const;

export type SeatToken = keyof typeof SEAT_TOKENS;
