import { AirportEntity } from '../entities/airport.entity';

export interface AirportRepository {
  findByCode(airportCode: string): AirportEntity | null;
  findAll(): AirportEntity[];
  save(airport: AirportEntity): void;
  delete(airportCode: string): void;
}
