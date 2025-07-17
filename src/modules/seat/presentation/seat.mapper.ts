import { Seat } from '../domain';
import {
  SeatResponseDto,
  SeatMapResponseDto,
  SeatStatisticsResponseDto,
} from './seat-response.dto';

export class SeatMapper {
  static toResponseDto(seat: Seat): SeatResponseDto {
    return {
      id: seat.id,
      flightId: seat.flightId,
      seatNumber: seat.seatNumber,
      row: seat.position.row,
      column: seat.position.column,
      seatClass: seat.seatClass,
      seatType: seat.seatType,
      status: seat.status,
      features: seat.features,
      basePrice: {
        amount: seat.basePrice.amount,
        currency: seat.basePrice.currency,
      },
      totalPrice: {
        amount: seat.totalPrice.amount,
        currency: seat.totalPrice.currency,
      },
      reservedBy: seat.reservedBy,
      reservedAt: seat.reservedAt,
      createdAt: seat.createdAt,
      updatedAt: seat.updatedAt,
    };
  }

  static toResponseDtoList(seats: Seat[]): SeatResponseDto[] {
    return seats.map((seat) => this.toResponseDto(seat));
  }

  static toSeatMapDto(data: {
    totalSeats: number;
    availableSeats: number;
    occupiedSeats: number;
    seatsByClass: Record<string, number>;
    seats: Seat[];
  }): SeatMapResponseDto {
    return {
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
      occupiedSeats: data.occupiedSeats,
      seatsByClass: data.seatsByClass,
      seats: this.toResponseDtoList(data.seats),
    };
  }

  static toStatisticsDto(stats: {
    total: number;
    available: number;
    reserved: number;
    occupied: number;
    blocked: number;
    byClass: Record<
      string,
      {
        total: number;
        available: number;
        reserved: number;
        occupied: number;
      }
    >;
  }): SeatStatisticsResponseDto {
    return {
      total: stats.total,
      available: stats.available,
      reserved: stats.reserved,
      occupied: stats.occupied,
      blocked: stats.blocked,
      byClass: stats.byClass,
    };
  }
}
