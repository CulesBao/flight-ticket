import { BaseEntity } from '../../../shared/domain';
import { BookingStatus, PassengerType } from './booking.enums';
import { Money } from '../../../shared/domain/value-objects';

export interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  type: PassengerType;
  seatNumber?: string;
}

export class Booking extends BaseEntity {
  constructor(
    id: string,
    public readonly userId: string,
    public readonly flightId: string,
    public readonly passengers: Passenger[],
    public readonly totalAmount: Money,
    public status: BookingStatus = BookingStatus.PENDING,
    public readonly bookingReference: string = Booking.generateReference(),
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    super(id);
  }

  static create(data: {
    userId: string;
    flightId: string;
    passengers: Passenger[];
    totalAmount: Money;
  }): Booking {
    const id =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    return new Booking(
      id,
      data.userId,
      data.flightId,
      data.passengers,
      data.totalAmount,
    );
  }

  private static generateReference(): string {
    return 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  confirm(): void {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be confirmed');
    }
    this.status = BookingStatus.CONFIRMED;
    this.updatedAt = new Date();
  }

  cancel(): void {
    if (
      this.status === BookingStatus.CANCELLED ||
      this.status === BookingStatus.COMPLETED
    ) {
      throw new Error('Cannot cancel booking with current status');
    }
    this.status = BookingStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  complete(): void {
    if (this.status !== BookingStatus.CONFIRMED) {
      throw new Error('Only confirmed bookings can be completed');
    }
    this.status = BookingStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  get passengerCount(): number {
    return this.passengers.length;
  }

  get adultCount(): number {
    return this.passengers.filter((p) => p.type === PassengerType.ADULT).length;
  }

  get childCount(): number {
    return this.passengers.filter((p) => p.type === PassengerType.CHILD).length;
  }

  get infantCount(): number {
    return this.passengers.filter((p) => p.type === PassengerType.INFANT)
      .length;
  }

  isConfirmed(): boolean {
    return this.status === BookingStatus.CONFIRMED;
  }

  isPending(): boolean {
    return this.status === BookingStatus.PENDING;
  }

  isCancelled(): boolean {
    return this.status === BookingStatus.CANCELLED;
  }
}
