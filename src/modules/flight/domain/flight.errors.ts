import { DomainError } from '../../../shared/domain';

export class FlightNotFoundError extends DomainError {
  constructor(flightId: string) {
    super(`Flight with ID ${flightId} not found`);
  }
}

export class FlightNotBookableError extends DomainError {
  constructor(flightNumber: string, reason: string) {
    super(`Flight ${flightNumber} is not bookable: ${reason}`);
  }
}

export class InsufficientSeatsError extends DomainError {
  constructor(flightNumber: string, requested: number, available: number) {
    super(
      `Flight ${flightNumber}: Requested ${requested} seats, but only ${available} available`,
    );
  }
}
