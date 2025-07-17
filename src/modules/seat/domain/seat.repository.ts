import { Repository } from '../../../shared/application';
import { PaginatedResult } from '../../../shared/domain';
import { Seat } from './seat.entity';
import { SeatClass, SeatStatus } from './seat.enums';

export interface SeatRepository extends Repository<Seat> {
  findByFlightId(flightId: string): Promise<Seat[]>;
  findByFlightIdAndClass(
    flightId: string,
    seatClass: SeatClass,
  ): Promise<Seat[]>;
  findByFlightIdAndStatus(
    flightId: string,
    status: SeatStatus,
  ): Promise<Seat[]>;
  findByFlightIdAndSeatNumber(
    flightId: string,
    seatNumber: string,
  ): Promise<Seat | null>;
  findReservedByUser(userId: string): Promise<Seat[]>;
  findAvailableSeats(
    flightId: string,
    seatClass?: SeatClass,
    pagination?: { page: number; limit: number },
  ): Promise<PaginatedResult<Seat>>;
  countAvailableSeats(flightId: string, seatClass?: SeatClass): Promise<number>;
  countOccupiedSeats(flightId: string): Promise<number>;
}

export const SEAT_REPOSITORY = 'SEAT_REPOSITORY';
