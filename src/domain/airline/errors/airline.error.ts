export class AirlineNotFoundError extends Error {
  constructor(airlineId: string) {
    super(`Airline with ID ${airlineId} not found`);
    this.name = 'AirlineNotFoundError';
  }
}
export class InvalidAirlineIdError extends Error {
  constructor(airlineId: string) {
    super(`Invalid airline ID: ${airlineId}`);
    this.name = 'InvalidAirlineIdError';
  }
}
