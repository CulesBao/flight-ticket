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
    // Removed seat counting - now managed by Seat module
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
  }

  updateStatus(status: FlightStatus): void {
    if (this._status === FlightStatus.CANCELLED) {
      throw new Error('Cannot update status of cancelled flight');
    }
    this._status = status;
  }

  isBookable(): boolean {
    return (
      this._status === FlightStatus.SCHEDULED &&
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
    );
  }
}
