import { SeatEntity } from '../entities/seat.entity';

export interface SeatRepository {
  findById(id: string): SeatEntity | null;
  findByFlightId(flightId: string): SeatEntity[];
  findAvailableByFlightId(flightId: string): SeatEntity[];
  save(seat: SeatEntity): void;
  delete(id: string): void;
}
