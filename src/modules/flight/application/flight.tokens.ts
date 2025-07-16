export const FLIGHT_TOKENS = {
  // Repository
  FLIGHT_REPOSITORY: 'FLIGHT_REPOSITORY',

  // Services
  FLIGHT_SERVICE: 'FLIGHT_SERVICE',
} as const;

export type FlightToken = keyof typeof FLIGHT_TOKENS;
