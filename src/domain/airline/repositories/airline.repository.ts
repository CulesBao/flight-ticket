import { AirlineEntity } from '../entities/airline.entity';

export interface AirlineRepository {
  findById(id: string): Promise<AirlineEntity | null>;
  findAll(): Promise<AirlineEntity[]>;
  save(airline: AirlineEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
