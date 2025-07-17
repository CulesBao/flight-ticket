import { BaseEntity } from '../../../shared/domain';
import { Money } from '../../../shared/domain/value-objects';
import { SeatClass, SeatType, SeatStatus, SeatFeature } from './seat.enums';

export class SeatPosition {
  constructor(
    public readonly row: number,
    public readonly column: string, // A, B, C, D, E, F
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.row <= 0) {
      throw new Error('Row must be greater than 0');
    }
    if (!/^[A-Z]$/.test(this.column)) {
      throw new Error('Column must be a single uppercase letter');
    }
  }

  toString(): string {
    return `${this.row}${this.column}`;
  }

  equals(other: SeatPosition): boolean {
    return this.row === other.row && this.column === other.column;
  }
}

export class Seat extends BaseEntity {
  constructor(
    id: string,
    public readonly flightId: string,
    public readonly position: SeatPosition,
    public readonly seatClass: SeatClass,
    public readonly seatType: SeatType,
    public readonly features: SeatFeature[],
    public readonly basePrice: Money,
    private _status: SeatStatus = SeatStatus.AVAILABLE,
    private _reservedBy?: string, // User ID who reserved this seat
    private _reservedAt?: Date,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    super(id);
  }

  get status(): SeatStatus {
    return this._status;
  }

  get reservedBy(): string | undefined {
    return this._reservedBy;
  }

  get reservedAt(): Date | undefined {
    return this._reservedAt;
  }

  get seatNumber(): string {
    return this.position.toString();
  }

  get totalPrice(): Money {
    // Calculate total price based on class and features
    let multiplier = 1;

    switch (this.seatClass) {
      case SeatClass.PREMIUM_ECONOMY:
        multiplier = 1.2;
        break;
      case SeatClass.BUSINESS:
        multiplier = 2.5;
        break;
      case SeatClass.FIRST:
        multiplier = 4.0;
        break;
      default:
        multiplier = 1;
    }

    // Add feature premiums
    if (this.features.includes(SeatFeature.EXTRA_LEGROOM)) {
      multiplier += 0.15;
    }
    if (this.features.includes(SeatFeature.POWER_OUTLET)) {
      multiplier += 0.05;
    }

    return new Money(
      Math.round(this.basePrice.amount * multiplier),
      this.basePrice.currency,
    );
  }

  static create(data: {
    flightId: string;
    row: number;
    column: string;
    seatClass: SeatClass;
    seatType: SeatType;
    features?: SeatFeature[];
    basePrice: Money;
  }): Seat {
    const position = new SeatPosition(data.row, data.column);
    const id = `${data.flightId}-${position.toString()}`;

    return new Seat(
      id,
      data.flightId,
      position,
      data.seatClass,
      data.seatType,
      data.features || [],
      data.basePrice,
    );
  }

  reserve(userId: string): void {
    if (this._status !== SeatStatus.AVAILABLE) {
      throw new Error(
        `Seat ${this.seatNumber} is not available for reservation`,
      );
    }

    this._status = SeatStatus.RESERVED;
    this._reservedBy = userId;
    this._reservedAt = new Date();
    this.updatedAt = new Date();
  }

  occupy(): void {
    if (this._status !== SeatStatus.RESERVED) {
      throw new Error(
        `Seat ${this.seatNumber} must be reserved before occupying`,
      );
    }

    this._status = SeatStatus.OCCUPIED;
    this.updatedAt = new Date();
  }

  release(): void {
    if (this._status === SeatStatus.BLOCKED) {
      throw new Error(
        `Seat ${this.seatNumber} is blocked and cannot be released`,
      );
    }

    this._status = SeatStatus.AVAILABLE;
    this._reservedBy = undefined;
    this._reservedAt = undefined;
    this.updatedAt = new Date();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  block(reason?: string): void {
    this._status = SeatStatus.BLOCKED;
    this._reservedBy = undefined;
    this._reservedAt = undefined;
    this.updatedAt = new Date();
  }

  unblock(): void {
    if (this._status !== SeatStatus.BLOCKED) {
      throw new Error(`Seat ${this.seatNumber} is not blocked`);
    }

    this._status = SeatStatus.AVAILABLE;
    this.updatedAt = new Date();
  }

  isAvailable(): boolean {
    return this._status === SeatStatus.AVAILABLE;
  }

  isReserved(): boolean {
    return this._status === SeatStatus.RESERVED;
  }

  isOccupied(): boolean {
    return this._status === SeatStatus.OCCUPIED;
  }

  isBlocked(): boolean {
    return this._status === SeatStatus.BLOCKED;
  }

  hasFeature(feature: SeatFeature): boolean {
    return this.features.includes(feature);
  }
}
