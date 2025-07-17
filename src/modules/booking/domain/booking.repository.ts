import { Repository } from '../../../shared/application';
import { PaginatedResult } from '../../../shared/domain';
import { Booking } from './booking.entity';

export interface BookingRepository extends Repository<Booking> {
  findByUserId(userId: string): Promise<Booking[]>;
  findByFlightId(flightId: string): Promise<Booking[]>;
  findByReference(reference: string): Promise<Booking | null>;
  findByStatus(
    status: string,
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<Booking>>;
}

export const BOOKING_REPOSITORY = 'BOOKING_REPOSITORY';
