export class AirportNotFoundError extends Error {
  constructor(airportCode: string) {
    super(`Airport with code ${airportCode} not found`);
    this.name = 'AirportNotFoundError';
  }
}

export class InvalidAirportCodeError extends Error {
  constructor(airportCode: string) {
    super(`Invalid airport code: ${airportCode}`);
    this.name = 'InvalidAirportCodeError';
  }
}
