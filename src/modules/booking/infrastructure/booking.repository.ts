import { Injectable } from '@nestjs/common';
import { InMemoryRepository } from '../../../shared/infrastructure';
import {
  Booking,
  BookingRepository,
  BookingStatus,
  PassengerType,
} from '../domain';
import { PaginatedResult } from '../../../shared/domain';
import { Money } from '../../../shared/domain/value-objects';

@Injectable()
export class InMemoryBookingRepository
  extends InMemoryRepository<Booking>
  implements BookingRepository
{
  constructor() {
    super();
    this.seedData();
  }

  protected getEntityId(entity: Booking): string {
    return entity.id;
  }

  findByUserId(userId: string): Promise<Booking[]> {
    const bookings = this.items.filter((booking) => booking.userId === userId);
    return Promise.resolve(bookings);
  }

  findByFlightId(flightId: string): Promise<Booking[]> {
    const bookings = this.items.filter(
      (booking) => booking.flightId === flightId,
    );
    return Promise.resolve(bookings);
  }

  findByReference(reference: string): Promise<Booking | null> {
    const booking =
      this.items.find((booking) => booking.bookingReference === reference) ||
      null;
    return Promise.resolve(booking);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByStatus(
    status: string,
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<Booking>> {
    const filteredBookings = this.items.filter(
      (booking) => booking.status === (status as BookingStatus),
    );
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

    return {
      data: paginatedBookings,
      total: filteredBookings.length,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(filteredBookings.length / pagination.limit),
    };
  }

  private seedData(): void {
    const bookings = [
      Booking.create({
        userId: 'user-1',
        flightId: 'flight-1',
        passengers: [
          {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: new Date('1985-06-15'),
            type: PassengerType.ADULT,
            seatNumber: '12A',
          },
        ],
        totalAmount: new Money(299.99, 'USD'),
      }),
      Booking.create({
        userId: 'user-2',
        flightId: 'flight-2',
        passengers: [
          {
            firstName: 'Jane',
            lastName: 'Smith',
            dateOfBirth: new Date('1990-03-22'),
            type: PassengerType.ADULT,
            seatNumber: '15B',
          },
          {
            firstName: 'Tommy',
            lastName: 'Smith',
            dateOfBirth: new Date('2015-08-10'),
            type: PassengerType.CHILD,
            seatNumber: '15C',
          },
        ],
        totalAmount: new Money(549.98, 'USD'),
      }),
    ];

    // Confirm first booking
    bookings[0].confirm();

    bookings.forEach((booking) => this.items.push(booking));
  }
}
