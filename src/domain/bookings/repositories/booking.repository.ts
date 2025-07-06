import { BookingEntity } from '../entities/booking.entity';

export interface BookingRepository {
  findById(id: string): BookingEntity | null;
  findAll(): BookingEntity[];
  save(booking: BookingEntity): void;
  delete(id: string): void;
}
