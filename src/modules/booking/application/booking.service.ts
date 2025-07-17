import { Injectable, Inject } from '@nestjs/common';
import {
  Booking,
  BookingRepository,
  BOOKING_REPOSITORY,
  BookingStatus,
  Passenger,
} from '../domain';
import { PaginationOptions, PaginatedResult } from '../../../shared/domain';
import { Money } from '../../../shared/domain/value-objects';

@Injectable()
export class BookingService {
  constructor(
    @Inject(BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async findAll(
    options?: PaginationOptions,
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.findAll(options);
  }

  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async findByReference(reference: string): Promise<Booking> {
    const booking = await this.bookingRepository.findByReference(reference);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return booking;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.bookingRepository.findByUserId(userId);
  }

  async findByFlightId(flightId: string): Promise<Booking[]> {
    return this.bookingRepository.findByFlightId(flightId);
  }

  async findByStatus(
    status: BookingStatus,
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.findByStatus(status, pagination);
  }

  async createBooking(data: {
    userId: string;
    flightId: string;
    passengers: Passenger[];
    totalAmount: { amount: number; currency: string };
  }): Promise<Booking> {
    const totalAmountMoney = new Money(
      data.totalAmount.amount,
      data.totalAmount.currency,
    );

    const booking = Booking.create({
      userId: data.userId,
      flightId: data.flightId,
      passengers: data.passengers,
      totalAmount: totalAmountMoney,
    });

    return this.bookingRepository.save(booking);
  }

  async confirmBooking(id: string): Promise<Booking> {
    const booking = await this.findById(id);
    booking.confirm();
    return this.bookingRepository.save(booking);
  }

  async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.findById(id);
    booking.cancel();
    return this.bookingRepository.save(booking);
  }

  async completeBooking(id: string): Promise<Booking> {
    const booking = await this.findById(id);
    booking.complete();
    return this.bookingRepository.save(booking);
  }

  async deleteBooking(id: string): Promise<void> {
    const booking = await this.findById(id);
    await this.bookingRepository.delete(booking.id);
  }

  async getBookingStatistics(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  }> {
    const allBookings = await this.bookingRepository.findAll();
    const bookings = allBookings.data;

    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.isPending()).length,
      confirmed: bookings.filter((b) => b.isConfirmed()).length,
      cancelled: bookings.filter((b) => b.isCancelled()).length,
      completed: bookings.filter((b) => b.status === BookingStatus.COMPLETED)
        .length,
    };
  }
}
