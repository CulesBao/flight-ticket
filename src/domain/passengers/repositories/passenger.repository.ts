import { PassengerEntity } from '../entities/passenger.entity';

export interface PassengerRepository {
  findById(id: string): PassengerEntity | null;
  findAll(): PassengerEntity[];
  save(passenger: PassengerEntity): void;
  delete(id: string): void;
}
