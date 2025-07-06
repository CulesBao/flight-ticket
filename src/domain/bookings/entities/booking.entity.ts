export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export interface BookingItem {
  readonly flightId: string;
  readonly seatId: string;
  readonly passengerId: string;
  readonly price: number;
}

export interface Booking {
  readonly id: string;
  readonly bookingReference: string;
  readonly userId: string;
  readonly items: BookingItem[];
  readonly totalAmount: number;
  readonly status: BookingStatus;
  readonly createdAt: Date;
  readonly expiresAt: Date;
  readonly confirmedAt?: Date;
  readonly cancelledAt?: Date;
}

export class BookingEntity implements Booking {
  constructor(
    public readonly id: string,
    public readonly bookingReference: string,
    public readonly userId: string,
    public readonly items: BookingItem[],
    public readonly totalAmount: number,
    public readonly status: BookingStatus,
    public readonly createdAt: Date,
    public readonly expiresAt: Date,
    public readonly confirmedAt?: Date,
    public readonly cancelledAt?: Date,
  ) {
    this.validateBookingReference(bookingReference);
    this.validateItems(items);
    this.validateTotalAmount(totalAmount, items);
    this.validateDates(createdAt, expiresAt);
  }

  private validateBookingReference(reference: string): void {
    if (!reference || reference.length !== 6) {
      throw new Error('Booking reference must be 6 characters');
    }
    if (!/^[A-Z0-9]{6}$/.test(reference)) {
      throw new Error(
        'Booking reference must contain only uppercase letters and numbers',
      );
    }
  }

  private validateItems(items: BookingItem[]): void {
    if (!items || items.length === 0) {
      throw new Error('Booking must have at least one item');
    }

    // Check for duplicate seats
    const seatIds = items.map((item) => item.seatId);
    const uniqueSeatIds = new Set(seatIds);
    if (seatIds.length !== uniqueSeatIds.size) {
      throw new Error('Booking cannot have duplicate seats');
    }
  }

  private validateTotalAmount(total: number, items: BookingItem[]): void {
    const calculatedTotal = items.reduce((sum, item) => sum + item.price, 0);
    if (Math.abs(total - calculatedTotal) > 0.01) {
      throw new Error('Total amount does not match sum of item prices');
    }
  }

  private validateDates(created: Date, expires: Date): void {
    if (created >= expires) {
      throw new Error('Expiry date must be after creation date');
    }
  }

  static generateBookingReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt && this.status === BookingStatus.PENDING;
  }

  canBeConfirmed(): boolean {
    return this.status === BookingStatus.PENDING && !this.isExpired();
  }

  canBeCancelled(): boolean {
    return (
      this.status === BookingStatus.PENDING ||
      this.status === BookingStatus.CONFIRMED
    );
  }

  confirm(): BookingEntity {
    if (!this.canBeConfirmed()) {
      throw new Error('Booking cannot be confirmed');
    }

    return new BookingEntity(
      this.id,
      this.bookingReference,
      this.userId,
      this.items,
      this.totalAmount,
      BookingStatus.CONFIRMED,
      this.createdAt,
      this.expiresAt,
      new Date(),
      this.cancelledAt,
    );
  }

  cancel(): BookingEntity {
    if (!this.canBeCancelled()) {
      throw new Error('Booking cannot be cancelled');
    }

    return new BookingEntity(
      this.id,
      this.bookingReference,
      this.userId,
      this.items,
      this.totalAmount,
      BookingStatus.CANCELLED,
      this.createdAt,
      this.expiresAt,
      this.confirmedAt,
      new Date(),
    );
  }

  complete(): BookingEntity {
    if (this.status !== BookingStatus.CONFIRMED) {
      throw new Error('Only confirmed bookings can be completed');
    }

    return new BookingEntity(
      this.id,
      this.bookingReference,
      this.userId,
      this.items,
      this.totalAmount,
      BookingStatus.COMPLETED,
      this.createdAt,
      this.expiresAt,
      this.confirmedAt,
      this.cancelledAt,
    );
  }

  expire(): BookingEntity {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be expired');
    }

    return new BookingEntity(
      this.id,
      this.bookingReference,
      this.userId,
      this.items,
      this.totalAmount,
      BookingStatus.EXPIRED,
      this.createdAt,
      this.expiresAt,
      this.confirmedAt,
      this.cancelledAt,
    );
  }
}
