import { Injectable, Inject } from '@nestjs/common';
import {
  Seat,
  SeatRepository,
  SEAT_REPOSITORY,
  SeatClass,
  SeatType,
  SeatFeature,
} from '../domain';
import { PaginationOptions, PaginatedResult } from '../../../shared/domain';
import { Money } from '../../../shared/domain/value-objects';
import {
  REDIS_TOKENS,
  RedisClusterService,
  REDLOCK_TOKENS,
  RedlockService,
} from 'src/infrastructure';

@Injectable()
export class SeatService {
  constructor(
    @Inject(SEAT_REPOSITORY)
    private readonly seatRepository: SeatRepository,
    @Inject(REDLOCK_TOKENS.REDLOCK_SERVICE)
    private readonly redlockService: RedlockService,
    @Inject(REDIS_TOKENS.REDIS_SERVICE)
    private readonly redisService: RedisClusterService,
  ) {}

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Seat>> {
    return this.seatRepository.findAll(options);
  }

  async findById(id: string): Promise<Seat> {
    const seat = await this.seatRepository.findById(id);
    if (!seat) {
      throw new Error('Seat not found');
    }
    return seat;
  }

  async findByFlightId(flightId: string): Promise<Seat[]> {
    return this.seatRepository.findByFlightId(flightId);
  }

  async findByFlightIdAndClass(
    flightId: string,
    seatClass: SeatClass,
  ): Promise<Seat[]> {
    return this.seatRepository.findByFlightIdAndClass(flightId, seatClass);
  }

  async findAvailableSeats(
    flightId: string,
    seatClass?: SeatClass,
    pagination?: { page: number; limit: number },
  ): Promise<PaginatedResult<Seat>> {
    return this.seatRepository.findAvailableSeats(
      flightId,
      seatClass,
      pagination,
    );
  }

  async findSeatByNumber(flightId: string, seatNumber: string): Promise<Seat> {
    const seat = await this.seatRepository.findByFlightIdAndSeatNumber(
      flightId,
      seatNumber,
    );
    if (!seat) {
      throw new Error(`Seat ${seatNumber} not found on flight ${flightId}`);
    }
    return seat;
  }

  async findReservedByUser(userId: string): Promise<Seat[]> {
    return this.seatRepository.findReservedByUser(userId);
  }

  async createSeat(data: {
    flightId: string;
    row: number;
    column: string;
    seatClass: SeatClass;
    seatType: SeatType;
    features?: SeatFeature[];
    basePrice: { amount: number; currency: string };
  }): Promise<Seat> {
    const basePrice = new Money(data.basePrice.amount, data.basePrice.currency);

    const seat = Seat.create({
      flightId: data.flightId,
      row: data.row,
      column: data.column,
      seatClass: data.seatClass,
      seatType: data.seatType,
      features: data.features,
      basePrice,
    });

    return this.seatRepository.save(seat);
  }

  async generateSeatsForFlight(
    flightId: string,
    aircraftConfig: {
      totalRows: number;
      columnsPerRow: string[];
      economyRows: { start: number; end: number };
      premiumEconomyRows?: { start: number; end: number };
      businessRows?: { start: number; end: number };
      firstRows?: { start: number; end: number };
    },
    basePrice: { amount: number; currency: string },
  ): Promise<Seat[]> {
    const seats: Seat[] = [];
    const basePriceMoney = new Money(basePrice.amount, basePrice.currency);

    for (let row = 1; row <= aircraftConfig.totalRows; row++) {
      // Determine seat class based on row
      let seatClass = SeatClass.ECONOMY;
      if (
        aircraftConfig.firstRows &&
        row >= aircraftConfig.firstRows.start &&
        row <= aircraftConfig.firstRows.end
      ) {
        seatClass = SeatClass.FIRST;
      } else if (
        aircraftConfig.businessRows &&
        row >= aircraftConfig.businessRows.start &&
        row <= aircraftConfig.businessRows.end
      ) {
        seatClass = SeatClass.BUSINESS;
      } else if (
        aircraftConfig.premiumEconomyRows &&
        row >= aircraftConfig.premiumEconomyRows.start &&
        row <= aircraftConfig.premiumEconomyRows.end
      ) {
        seatClass = SeatClass.PREMIUM_ECONOMY;
      }

      for (let i = 0; i < aircraftConfig.columnsPerRow.length; i++) {
        const column = aircraftConfig.columnsPerRow[i];

        // Determine seat type
        let seatType = SeatType.MIDDLE;
        if (i === 0 || i === aircraftConfig.columnsPerRow.length - 1) {
          seatType = SeatType.WINDOW;
        } else if (i === 1 || i === aircraftConfig.columnsPerRow.length - 2) {
          seatType = SeatType.AISLE;
        }

        // Add features based on class and position
        const features: SeatFeature[] = [];
        if (seatClass === SeatClass.BUSINESS || seatClass === SeatClass.FIRST) {
          features.push(
            SeatFeature.EXTRA_LEGROOM,
            SeatFeature.POWER_OUTLET,
            SeatFeature.WIFI,
            SeatFeature.MEAL_SERVICE,
            SeatFeature.PRIORITY_BOARDING,
          );
        } else if (seatClass === SeatClass.PREMIUM_ECONOMY) {
          features.push(
            SeatFeature.EXTRA_LEGROOM,
            SeatFeature.POWER_OUTLET,
            SeatFeature.PRIORITY_BOARDING,
          );
        }

        const seat = Seat.create({
          flightId,
          row,
          column,
          seatClass,
          seatType,
          features,
          basePrice: basePriceMoney,
        });

        seats.push(seat);
      }
    }

    // Save all seats
    const savedSeats: Seat[] = [];
    for (const seat of seats) {
      const savedSeat = await this.seatRepository.save(seat);
      savedSeats.push(savedSeat);
    }

    return savedSeats;
  }

  async reserveSeat(seatId: string, userId: string): Promise<Seat> {
    const seat = await this.findById(seatId);
    seat.reserve(userId);
    return this.seatRepository.save(seat);
  }

  async reserveSeatByNumber(
    flightId: string,
    seatNumber: string,
    userId: string,
  ): Promise<Seat> {
    const lockKey = `seat:${flightId}:${seatNumber}`;

    return await this.redlockService.using([lockKey], 5000, async () => {
      const seat = await this.findSeatByNumber(flightId, seatNumber);

      seat.reserve(userId);

      const savedSeat = await this.seatRepository.save(seat);

      await this.redisService.set(
        `seat:${flightId}:${seatNumber}`,
        JSON.stringify({
          id: savedSeat.id,
          flightId: savedSeat.flightId,
          seatNumber: savedSeat.seatNumber,
          status: savedSeat.status,
          reservedBy: savedSeat.reservedBy,
          reservedAt: savedSeat.reservedAt,
        }),
        3600,
      );

      return savedSeat;
    });
  }

  async occupySeat(seatId: string): Promise<Seat> {
    const seat = await this.findById(seatId);
    seat.occupy();
    return this.seatRepository.save(seat);
  }

  async releaseSeat(seatId: string): Promise<Seat> {
    const seat = await this.findById(seatId);
    seat.release();
    const releasedSeat = await this.seatRepository.save(seat);

    // Invalidate cache for this seat
    await this.redisService.del(
      `seat:${releasedSeat.flightId}:${releasedSeat.seatNumber}`,
    );

    return releasedSeat;
  }

  async blockSeat(seatId: string, reason?: string): Promise<Seat> {
    const seat = await this.findById(seatId);
    seat.block(reason);
    const blockedSeat = await this.seatRepository.save(seat);

    // Invalidate cache for this seat
    await this.redisService.del(
      `seat:${blockedSeat.flightId}:${blockedSeat.seatNumber}`,
    );

    return blockedSeat;
  }

  async unblockSeat(seatId: string): Promise<Seat> {
    const seat = await this.findById(seatId);
    seat.unblock();
    const unblockedSeat = await this.seatRepository.save(seat);

    // Invalidate cache for this seat
    await this.redisService.del(
      `seat:${unblockedSeat.flightId}:${unblockedSeat.seatNumber}`,
    );

    return unblockedSeat;
  }

  async getFlightSeatMap(flightId: string): Promise<{
    totalSeats: number;
    availableSeats: number;
    occupiedSeats: number;
    seatsByClass: Record<SeatClass, number>;
    seats: Seat[];
  }> {
    const seats = await this.findByFlightId(flightId);
    const availableSeats =
      await this.seatRepository.countAvailableSeats(flightId);
    const occupiedSeats =
      await this.seatRepository.countOccupiedSeats(flightId);

    const seatsByClass = seats.reduce(
      (acc, seat) => {
        acc[seat.seatClass] = (acc[seat.seatClass] || 0) + 1;
        return acc;
      },
      {} as Record<SeatClass, number>,
    );

    return {
      totalSeats: seats.length,
      availableSeats,
      occupiedSeats,
      seatsByClass,
      seats,
    };
  }

  async getSeatStatistics(flightId: string): Promise<{
    total: number;
    available: number;
    reserved: number;
    occupied: number;
    blocked: number;
    byClass: Record<
      SeatClass,
      {
        total: number;
        available: number;
        reserved: number;
        occupied: number;
      }
    >;
  }> {
    const seats = await this.findByFlightId(flightId);

    const stats = {
      total: seats.length,
      available: seats.filter((s) => s.isAvailable()).length,
      reserved: seats.filter((s) => s.isReserved()).length,
      occupied: seats.filter((s) => s.isOccupied()).length,
      blocked: seats.filter((s) => s.isBlocked()).length,
      byClass: {} as Record<
        SeatClass,
        {
          total: number;
          available: number;
          reserved: number;
          occupied: number;
        }
      >,
    };

    // Calculate by class
    Object.values(SeatClass).forEach((seatClass) => {
      const classSeats = seats.filter((s) => s.seatClass === seatClass);
      stats.byClass[seatClass] = {
        total: classSeats.length,
        available: classSeats.filter((s) => s.isAvailable()).length,
        reserved: classSeats.filter((s) => s.isReserved()).length,
        occupied: classSeats.filter((s) => s.isOccupied()).length,
      };
    });

    return stats;
  }

  async deleteSeat(seatId: string): Promise<void> {
    const seat = await this.findById(seatId);
    await this.seatRepository.delete(seat.id);
  }
}
