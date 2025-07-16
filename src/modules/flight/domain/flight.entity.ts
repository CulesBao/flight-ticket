import { BaseEntity, Money } from '../../../shared/domain';
import { FlightNumber } from './flight-number.vo';
import { FlightStatus, AircraftType } from './flight.enums';

export class Flight extends BaseEntity {
  constructor(
    id: string,
    private readonly _flightNumber: FlightNumber,
    private readonly _departureAirport: string, // Airport code
    private readonly _arrivalAirport: string, // Airport code
    private readonly _departureTime: Date,
    private readonly _arrivalTime: Date,
    private readonly _aircraftType: AircraftType,
    private readonly _basePrice: Money,
    private _status: FlightStatus = FlightStatus.SCHEDULED,
    private _availableSeats: number = 150,
    private readonly _totalSeats: number = 150,
  ) {
    super(id);
    this._validate();
  }

  get flightNumber(): FlightNumber {
    return this._flightNumber;
  }

  get departureAirport(): string {
    return this._departureAirport;
  }

  get arrivalAirport(): string {
    return this._arrivalAirport;
  }

  get departureTime(): Date {
    return this._departureTime;
  }

  get arrivalTime(): Date {
    return this._arrivalTime;
  }

  get aircraftType(): AircraftType {
    return this._aircraftType;
  }

  get basePrice(): Money {
    return this._basePrice;
  }

  get status(): FlightStatus {
    return this._status;
  }

  get availableSeats(): number {
    return this._availableSeats;
  }

  get totalSeats(): number {
    return this._totalSeats;
  }

  get duration(): number {
    return this._arrivalTime.getTime() - this._departureTime.getTime();
  }

  private _validate(): void {
    if (this._departureTime >= this._arrivalTime) {
      throw new Error('Departure time must be before arrival time');
    }

    if (this._departureAirport === this._arrivalAirport) {
      throw new Error('Departure and arrival airports cannot be the same');
    }

    if (this._totalSeats <= 0) {
      throw new Error('Total seats must be greater than 0');
    }

    if (this._availableSeats < 0 || this._availableSeats > this._totalSeats) {
      throw new Error('Available seats must be between 0 and total seats');
    }
  }

  updateStatus(status: FlightStatus): void {
    if (this._status === FlightStatus.CANCELLED) {
      throw new Error('Cannot update status of cancelled flight');
    }
    this._status = status;
  }

  reserveSeats(count: number): void {
    if (count <= 0) {
      throw new Error('Seat count must be greater than 0');
    }

    if (this._availableSeats < count) {
      throw new Error(
        `Not enough seats available. Only ${this._availableSeats} seats left`,
      );
    }

    if (this._status === FlightStatus.CANCELLED) {
      throw new Error('Cannot reserve seats on cancelled flight');
    }

    this._availableSeats -= count;
  }

  releaseSeats(count: number): void {
    if (count <= 0) {
      throw new Error('Seat count must be greater than 0');
    }

    const newAvailableSeats = this._availableSeats + count;
    if (newAvailableSeats > this._totalSeats) {
      throw new Error('Cannot release more seats than total capacity');
    }

    this._availableSeats = newAvailableSeats;
  }

  isBookable(): boolean {
    return (
      this._status === FlightStatus.SCHEDULED &&
      this._availableSeats > 0 &&
      this._departureTime > new Date()
    );
  }

  static create(
    flightNumber: string,
    departureAirport: string,
    arrivalAirport: string,
    departureTime: Date,
    arrivalTime: Date,
    aircraftType: AircraftType,
    basePrice: number,
    currency: string = 'VND',
    totalSeats: number = 150,
  ): Flight {
    const flightNumberVo = new FlightNumber(flightNumber);
    const price = new Money(basePrice, currency);
    const id = `${flightNumber}-${departureTime.toISOString().split('T')[0]}`;

    return new Flight(
      id,
      flightNumberVo,
      departureAirport,
      arrivalAirport,
      departureTime,
      arrivalTime,
      aircraftType,
      price,
      FlightStatus.SCHEDULED,
      totalSeats,
      totalSeats,
    );
  }
}
