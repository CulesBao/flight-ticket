import { Injectable } from '@nestjs/common';
import {
  BookingEntity,
  BookingRepository,
  BookingStatus,
} from 'src/domain/bookings';

@Injectable()
export class InMemoryBookingRepository implements BookingRepository {
  private bookings: BookingEntity[] = [
    new BookingEntity(
      'booking-1',
      'ABC123',
      'user-1',
      [
        {
          flightId: 'flight-1',
          seatId: 'seat-1',
          passengerId: 'passenger-1',
          price: 100,
        },
        {
          flightId: 'flight-1',
          seatId: 'seat-2',
          passengerId: 'passenger-2',
          price: 100,
        },
      ],
      200,
      BookingStatus.CONFIRMED,
      new Date('2024-06-01T10:00:00Z'),
      new Date('2024-06-01T12:00:00Z'),
      new Date('2024-06-01T10:05:00Z'),
      undefined,
    ),
    new BookingEntity(
      'booking-2',
      'XYZ789',
      'user-2',
      [
        {
          flightId: 'flight-2',
          seatId: 'seat-4',
          passengerId: 'passenger-3',
          price: 120,
        },
      ],
      120,
      BookingStatus.PENDING,
      new Date('2024-06-02T09:00:00Z'),
      new Date('2024-06-02T11:00:00Z'),
      undefined,
      undefined,
    ),
  ];

  findById(id: string): BookingEntity | null {
    return this.bookings.find((b) => b.id === id) || null;
  }

  findAll(): BookingEntity[] {
    return [...this.bookings];
  }

  save(booking: BookingEntity): void {
    const idx = this.bookings.findIndex((b) => b.id === booking.id);
    if (idx !== -1) {
      this.bookings[idx] = booking;
    } else {
      this.bookings.push(booking);
    }
  }

  delete(id: string): void {
    this.bookings = this.bookings.filter((b) => b.id !== id);
  }
}
