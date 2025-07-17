import { Injectable } from '@nestjs/common';
import { InMemoryRepository } from '../../../shared/infrastructure';
import {
  Seat,
  SeatRepository,
  SeatClass,
  SeatStatus,
  SeatType,
  SeatFeature,
} from '../domain';
import { PaginatedResult } from '../../../shared/domain';
import { Money } from '../../../shared/domain/value-objects';

@Injectable()
export class InMemorySeatRepository
  extends InMemoryRepository<Seat>
  implements SeatRepository
{
  constructor() {
    super();
    this.seedData();
  }

  protected getEntityId(entity: Seat): string {
    return entity.id;
  }

  findByFlightId(flightId: string): Promise<Seat[]> {
    const seats = this.items.filter((seat) => seat.flightId === flightId);
    return Promise.resolve(seats);
  }

  findByFlightIdAndClass(
    flightId: string,
    seatClass: SeatClass,
  ): Promise<Seat[]> {
    const seats = this.items.filter(
      (seat) => seat.flightId === flightId && seat.seatClass === seatClass,
    );
    return Promise.resolve(seats);
  }

  findByFlightIdAndStatus(
    flightId: string,
    status: SeatStatus,
  ): Promise<Seat[]> {
    const seats = this.items.filter(
      (seat) => seat.flightId === flightId && seat.status === status,
    );
    return Promise.resolve(seats);
  }

  findByFlightIdAndSeatNumber(
    flightId: string,
    seatNumber: string,
  ): Promise<Seat | null> {
    const seat =
      this.items.find(
        (seat) => seat.flightId === flightId && seat.seatNumber === seatNumber,
      ) || null;
    return Promise.resolve(seat);
  }

  findReservedByUser(userId: string): Promise<Seat[]> {
    const seats = this.items.filter(
      (seat) => seat.reservedBy === userId && seat.isReserved(),
    );
    return Promise.resolve(seats);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findAvailableSeats(
    flightId: string,
    seatClass?: SeatClass,
    pagination?: { page: number; limit: number },
  ): Promise<PaginatedResult<Seat>> {
    let seats = this.items.filter(
      (seat) => seat.flightId === flightId && seat.isAvailable(),
    );

    if (seatClass) {
      seats = seats.filter((seat) => seat.seatClass === seatClass);
    }

    if (pagination) {
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedSeats = seats.slice(startIndex, endIndex);

      return {
        data: paginatedSeats,
        total: seats.length,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(seats.length / pagination.limit),
      };
    }

    return {
      data: seats,
      total: seats.length,
      page: 1,
      limit: seats.length,
      totalPages: 1,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async countAvailableSeats(
    flightId: string,
    seatClass?: SeatClass,
  ): Promise<number> {
    let seats = this.items.filter(
      (seat) => seat.flightId === flightId && seat.isAvailable(),
    );

    if (seatClass) {
      seats = seats.filter((seat) => seat.seatClass === seatClass);
    }

    return seats.length;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async countOccupiedSeats(flightId: string): Promise<number> {
    const seats = this.items.filter(
      (seat) => seat.flightId === flightId && seat.isOccupied(),
    );
    return seats.length;
  }

  private seedData(): void {
    const basePrice = new Money(50000, 'VND'); // Base price 50,000 VND

    // Sample seats for flight VJ101
    const vj101Seats = this.generateFlightSeats('VJ101-2025-07-17', basePrice);

    // Sample seats for flight VN202
    const vn202Seats = this.generateFlightSeats('VN202-2025-07-17', basePrice);

    [...vj101Seats, ...vn202Seats].forEach((seat) => this.items.push(seat));

    // Reserve some seats for demonstration
    const sampleReservations = [
      { seatNumber: '12A', userId: 'user-1' },
      { seatNumber: '12B', userId: 'user-1' },
      { seatNumber: '15C', userId: 'user-2' },
    ];

    sampleReservations.forEach(({ seatNumber, userId }) => {
      const seat = this.items.find(
        (s) => s.seatNumber === seatNumber && s.flightId === 'VJ101-2025-07-17',
      );
      if (seat) {
        seat.reserve(userId);
      }
    });
  }

  private generateFlightSeats(flightId: string, basePrice: Money): Seat[] {
    const seats: Seat[] = [];

    // Economy seats: rows 7-30 (columns A-F)
    for (let row = 7; row <= 30; row++) {
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach((column, index) => {
        let seatType = SeatType.MIDDLE;
        if (index === 0 || index === 5) seatType = SeatType.WINDOW;
        else if (index === 2 || index === 3) seatType = SeatType.AISLE;

        const seat = Seat.create({
          flightId,
          row,
          column,
          seatClass: SeatClass.ECONOMY,
          seatType,
          features: [],
          basePrice,
        });
        seats.push(seat);
      });
    }

    // Premium Economy seats: rows 4-6 (columns A-F)
    for (let row = 4; row <= 6; row++) {
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach((column, index) => {
        let seatType = SeatType.MIDDLE;
        if (index === 0 || index === 5) seatType = SeatType.WINDOW;
        else if (index === 2 || index === 3) seatType = SeatType.AISLE;

        const seat = Seat.create({
          flightId,
          row,
          column,
          seatClass: SeatClass.PREMIUM_ECONOMY,
          seatType,
          features: [SeatFeature.EXTRA_LEGROOM, SeatFeature.PRIORITY_BOARDING],
          basePrice,
        });
        seats.push(seat);
      });
    }

    // Business seats: rows 1-3 (columns A-D)
    for (let row = 1; row <= 3; row++) {
      ['A', 'B', 'C', 'D'].forEach((column, index) => {
        let seatType = SeatType.MIDDLE;
        if (index === 0 || index === 3) seatType = SeatType.WINDOW;
        else seatType = SeatType.AISLE;

        const seat = Seat.create({
          flightId,
          row,
          column,
          seatClass: SeatClass.BUSINESS,
          seatType,
          features: [
            SeatFeature.EXTRA_LEGROOM,
            SeatFeature.POWER_OUTLET,
            SeatFeature.WIFI,
            SeatFeature.MEAL_SERVICE,
            SeatFeature.PRIORITY_BOARDING,
          ],
          basePrice,
        });
        seats.push(seat);
      });
    }

    return seats;
  }
}
