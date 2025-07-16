import { Repository } from '../../../shared/application';
import { Airport } from './airport.entity';

export interface AirportRepository extends Repository<Airport> {
  findByCode(code: string): Promise<Airport | null>;
}
