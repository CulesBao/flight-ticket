export class SeatResponseDto {
  id: string;

  flightId: string;

  seatNumber: string;

  row: number;

  column: string;

  seatClass: string;

  seatType: string;

  status: string;

  features: string[];

  basePrice: { amount: number; currency: string };

  totalPrice: { amount: number; currency: string };

  reservedBy?: string;

  reservedAt?: Date;

  createdAt: Date;

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
