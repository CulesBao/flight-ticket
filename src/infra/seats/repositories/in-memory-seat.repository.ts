import { Injectable } from '@nestjs/common';
import {
  SeatEntity,
  SeatClass,
  SeatStatus,
  SeatRepository,
} from 'src/domain/seats';

@Injectable()
export class InMemorySeatRepository implements SeatRepository {
  private seats: SeatEntity[] = [
    new SeatEntity(
      'seat-1',
      'flight-1',
      '12A',
      SeatClass.ECONOMY,
      SeatStatus.AVAILABLE,
      100,
      true,
      false,
    ),
    new SeatEntity(
      'seat-2',
      'flight-1',
      '12B',
      SeatClass.ECONOMY,
      SeatStatus.OCCUPIED,
      100,
      false,
      true,
    ),
    new SeatEntity(
      'seat-3',
      'flight-1',
      '1A',
      SeatClass.BUSINESS,
      SeatStatus.AVAILABLE,
      300,
      true,
      false,
    ),
    new SeatEntity(
      'seat-4',
      'flight-2',
      '14C',
      SeatClass.ECONOMY,
      SeatStatus.AVAILABLE,
      120,
      false,
      true,
    ),
    new SeatEntity(
      'seat-5',
      'flight-2',
      '2A',
      SeatClass.FIRST,
      SeatStatus.RESERVED,
      500,
      true,
      false,
    ),
  ];

  findById(id: string): SeatEntity | null {
    return this.seats.find((s) => s.id === id) || null;
  }

  findByFlightId(flightId: string): SeatEntity[] {
    return this.seats.filter((s) => s.flightId === flightId);
  }

  findAvailableByFlightId(flightId: string): SeatEntity[] {
    return this.seats.filter((s) => s.flightId === flightId && s.isAvailable());
  }

  findAll(): SeatEntity[] {
    return [...this.seats];
  }

  save(seat: SeatEntity): void {
    const idx = this.seats.findIndex((s) => s.id === seat.id);
    if (idx !== -1) {
      this.seats[idx] = seat;
    } else {
      this.seats.push(seat);
    }
  }

  delete(id: string): void {
    this.seats = this.seats.filter((s) => s.id !== id);
  }
}
