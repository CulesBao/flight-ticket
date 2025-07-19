import { ApiProperty } from '@nestjs/swagger';

export class SeatResponseDto {
  @ApiProperty({ example: 'VJ101-2025-07-17-12A', description: 'Seat ID' })
  id: string;

  @ApiProperty({ example: 'VJ101-2025-07-17', description: 'Flight ID' })
  flightId: string;

  @ApiProperty({ example: '12A', description: 'Seat number' })
  seatNumber: string;

  @ApiProperty({ example: 12, description: 'Row number' })
  row: number;

  @ApiProperty({ example: 'A', description: 'Column letter' })
  column: string;

  @ApiProperty({
    example: 'economy',
    enum: ['economy', 'business', 'first'],
    description: 'Seat class',
  })
  seatClass: string;

  @ApiProperty({
    example: 'window',
    enum: ['window', 'middle', 'aisle'],
    description: 'Seat type',
  })
  seatType: string;

  @ApiProperty({
    example: 'available',
    enum: ['available', 'reserved', 'blocked'],
    description: 'Seat status',
  })
  status: string;

  @ApiProperty({
    example: ['extra_legroom', 'power_outlet'],
    type: [String],
    description: 'Seat features',
  })
  features: string[];

  @ApiProperty({
    example: { amount: 50000, currency: 'VND' },
    description: 'Base price',
  })
  basePrice: { amount: number; currency: string };

  @ApiProperty({
    example: { amount: 50000, currency: 'VND' },
    description: 'Total price',
  })
  totalPrice: { amount: number; currency: string };

  @ApiProperty({
    example: 'user-123',
    required: false,
    description: 'Reserved by user ID',
  })
  reservedBy?: string;

  @ApiProperty({
    example: '2025-07-17T10:30:00Z',
    required: false,
    description: 'Reserved at',
  })
  reservedAt?: Date;

  @ApiProperty({ example: '2025-07-17T09:00:00Z', description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-17T10:30:00Z', description: 'Updated at' })
  updatedAt: Date;
}

export class SeatMapResponseDto {
  totalSeats: number;

  availableSeats: number;

  occupiedSeats: number;

  seatsByClass: Record<string, number>;

  seats: SeatResponseDto[];
}

export class SeatStatisticsResponseDto {
  total: number;

  available: number;

  reserved: number;
  occupied: number;
  blocked: number;

  byClass: Record<
    string,
    { total: number; available: number; reserved: number; occupied: number }
  >;
}
