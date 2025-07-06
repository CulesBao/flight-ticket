export enum SeatClass {
  ECONOMY = 'ECONOMY',
  BUSINESS = 'BUSINESS',
  FIRST = 'FIRST',
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  BLOCKED = 'BLOCKED',
}

export interface Seat {
  readonly id: string;
  readonly flightId: string;
  readonly seatNumber: string;
  readonly seatClass: SeatClass;
  readonly status: SeatStatus;
  readonly price: number;
  readonly isWindowSeat: boolean;
  readonly isAisleSeat: boolean;
}

export class SeatEntity implements Seat {
  constructor(
    public readonly id: string,
    public readonly flightId: string,
    public readonly seatNumber: string,
    public readonly seatClass: SeatClass,
    public readonly status: SeatStatus,
    public readonly price: number,
    public readonly isWindowSeat: boolean,
    public readonly isAisleSeat: boolean,
  ) {
    this.validateSeatNumber(seatNumber);
    this.validatePrice(price);
  }

  private validateSeatNumber(seatNumber: string): void {
    if (!seatNumber || !/^[0-9]+[A-Z]$/.test(seatNumber)) {
      throw new Error('Invalid seat number format. Expected format: 12A');
    }
  }

  private validatePrice(price: number): void {
    if (price < 0) {
      throw new Error('Seat price cannot be negative');
    }
  }

  isAvailable(): boolean {
    return this.status === SeatStatus.AVAILABLE;
  }

  reserve(): SeatEntity {
    if (!this.isAvailable()) {
      throw new Error('Seat is not available for reservation');
    }

    return new SeatEntity(
      this.id,
      this.flightId,
      this.seatNumber,
      this.seatClass,
      SeatStatus.RESERVED,
      this.price,
      this.isWindowSeat,
      this.isAisleSeat,
    );
  }

  occupy(): SeatEntity {
    if (this.status !== SeatStatus.RESERVED) {
      throw new Error('Seat must be reserved before occupying');
    }

    return new SeatEntity(
      this.id,
      this.flightId,
      this.seatNumber,
      this.seatClass,
      SeatStatus.OCCUPIED,
      this.price,
      this.isWindowSeat,
      this.isAisleSeat,
    );
  }

  release(): SeatEntity {
    return new SeatEntity(
      this.id,
      this.flightId,
      this.seatNumber,
      this.seatClass,
      SeatStatus.AVAILABLE,
      this.price,
      this.isWindowSeat,
      this.isAisleSeat,
    );
  }
}
