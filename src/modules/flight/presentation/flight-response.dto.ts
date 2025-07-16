import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FlightStatus, AircraftType } from '../domain/flight.enums';

export class FlightResponseDto {
  @ApiProperty({ example: 'VN123-2025-07-17' })
  id: string;

  @ApiProperty({ example: 'VN123' })
  flightNumber: string;

  @ApiProperty({ example: 'SGN' })
  departureAirport: string;

  @ApiProperty({ example: 'HAN' })
  arrivalAirport: string;

  @ApiProperty({ example: '2025-07-17T08:00:00.000Z' })
  departureTime: string;

  @ApiProperty({ example: '2025-07-17T10:00:00.000Z' })
  arrivalTime: string;

  @ApiProperty({ enum: AircraftType, example: AircraftType.AIRBUS_A320 })
  aircraftType: AircraftType;

  @ApiProperty({ example: 2500000 })
  basePrice: number;

  @ApiProperty({ example: 'VND' })
  currency: string;

  @ApiProperty({ enum: FlightStatus, example: FlightStatus.SCHEDULED })
  status: FlightStatus;

  @ApiProperty({ example: 150 })
  availableSeats: number;

  @ApiProperty({ example: 180 })
  totalSeats: number;

  @ApiProperty({ example: 7200000, description: 'Duration in milliseconds' })
  duration: number;

  constructor(data: {
    id: string;
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    aircraftType: AircraftType;
    basePrice: number;
    currency: string;
    status: FlightStatus;
    availableSeats: number;
    totalSeats: number;
    duration: number;
  }) {
    this.id = data.id;
    this.flightNumber = data.flightNumber;
    this.departureAirport = data.departureAirport;
    this.arrivalAirport = data.arrivalAirport;
    this.departureTime = data.departureTime;
    this.arrivalTime = data.arrivalTime;
    this.aircraftType = data.aircraftType;
    this.basePrice = data.basePrice;
    this.currency = data.currency;
    this.status = data.status;
    this.availableSeats = data.availableSeats;
    this.totalSeats = data.totalSeats;
    this.duration = data.duration;
  }
}
