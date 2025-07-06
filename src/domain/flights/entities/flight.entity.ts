export enum FlightStatus {
  SCHEDULED = 'SCHEDULED',
  DELAYED = 'DELAYED',
  BOARDING = 'BOARDING',
  DEPARTED = 'DEPARTED',
  IN_FLIGHT = 'IN_FLIGHT',
  ARRIVED = 'ARRIVED',
  CANCELLED = 'CANCELLED',
}

export interface Flight {
  readonly id: string;
  readonly flightNumber: string;
  readonly airlineCode: string;
  readonly departureAirportCode: string;
  readonly arrivalAirportCode: string;
  readonly departureTime: Date;
  readonly arrivalTime: Date;
  readonly duration: number; // in minutes
  readonly aircraftType: string;
  readonly status: FlightStatus;
  readonly basePrice: number;
  readonly totalSeats: number;
  readonly availableSeats: number;
}

export class FlightEntity implements Flight {
  constructor(
    public readonly id: string,
    public readonly flightNumber: string,
    public readonly airlineCode: string,
    public readonly departureAirportCode: string,
    public readonly arrivalAirportCode: string,
    public readonly departureTime: Date,
    public readonly arrivalTime: Date,
    public readonly duration: number,
    public readonly aircraftType: string,
    public readonly status: FlightStatus,
    public readonly basePrice: number,
    public readonly totalSeats: number,
    public readonly availableSeats: number,
  ) {
    this.validateFlightNumber(flightNumber);
    this.validateAirportCodes(departureAirportCode, arrivalAirportCode);
    this.validateTimes(departureTime, arrivalTime);
    this.validateSeats(totalSeats, availableSeats);
    this.validatePrice(basePrice);
  }

  private validateFlightNumber(flightNumber: string): void {
    const flightRegex = /^[A-Z]{2,3}[0-9]{1,4}$/;
    if (!flightRegex.test(flightNumber)) {
      throw new Error(
        'Invalid flight number format. Expected format: AA123 or AAA1234',
      );
    }
  }

  private validateAirportCodes(departure: string, arrival: string): void {
    const airportRegex = /^[A-Z]{3}$/;
    if (!airportRegex.test(departure)) {
      throw new Error(
        'Invalid departure airport code. Must be 3 uppercase letters',
      );
    }
    if (!airportRegex.test(arrival)) {
      throw new Error(
        'Invalid arrival airport code. Must be 3 uppercase letters',
      );
    }
    if (departure === arrival) {
      throw new Error('Departure and arrival airports cannot be the same');
    }
  }

  private validateTimes(departure: Date, arrival: Date): void {
    if (departure >= arrival) {
      throw new Error('Departure time must be before arrival time');
    }
    if (departure <= new Date()) {
      throw new Error('Departure time must be in the future');
    }
  }

  private validateSeats(total: number, available: number): void {
    if (total <= 0) {
      throw new Error('Total seats must be positive');
    }
    if (available < 0 || available > total) {
      throw new Error('Available seats must be between 0 and total seats');
    }
  }

  private validatePrice(price: number): void {
    if (price <= 0) {
      throw new Error('Base price must be positive');
    }
  }

  isBookable(): boolean {
    return (
      this.status === FlightStatus.SCHEDULED &&
      this.availableSeats > 0 &&
      this.departureTime > new Date()
    );
  }

  updateStatus(newStatus: FlightStatus): FlightEntity {
    return new FlightEntity(
      this.id,
      this.flightNumber,
      this.airlineCode,
      this.departureAirportCode,
      this.arrivalAirportCode,
      this.departureTime,
      this.arrivalTime,
      this.duration,
      this.aircraftType,
      newStatus,
      this.basePrice,
      this.totalSeats,
      this.availableSeats,
    );
  }

  reserveSeat(): FlightEntity {
    if (this.availableSeats <= 0) {
      throw new Error('No available seats');
    }

    return new FlightEntity(
      this.id,
      this.flightNumber,
      this.airlineCode,
      this.departureAirportCode,
      this.arrivalAirportCode,
      this.departureTime,
      this.arrivalTime,
      this.duration,
      this.aircraftType,
      this.status,
      this.basePrice,
      this.totalSeats,
      this.availableSeats - 1,
    );
  }

  releaseSeat(): FlightEntity {
    if (this.availableSeats >= this.totalSeats) {
      throw new Error('Cannot release more seats than total');
    }

    return new FlightEntity(
      this.id,
      this.flightNumber,
      this.airlineCode,
      this.departureAirportCode,
      this.arrivalAirportCode,
      this.departureTime,
      this.arrivalTime,
      this.duration,
      this.aircraftType,
      this.status,
      this.basePrice,
      this.totalSeats,
      this.availableSeats + 1,
    );
  }
}
