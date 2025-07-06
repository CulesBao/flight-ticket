import { FlightEntity } from '../entities/flight.entity';

export interface FlightRepository {
  findById(id: string): FlightEntity | null;
  findAll(): FlightEntity[];
  save(flight: FlightEntity): void;
  delete(id: string): void;
}
