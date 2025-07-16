import { Repository } from '../../../shared/application';
import { Flight } from './flight.entity';

export interface FlightSearchCriteria {
  departureAirport?: string;
  arrivalAirport?: string;
  departureDate?: Date;
  minPrice?: number;
  maxPrice?: number;
}

export interface FlightRepository extends Repository<Flight> {
  findByFlightNumber(flightNumber: string): Promise<Flight | null>;
  findByRoute(
    departureAirport: string,
    arrivalAirport: string,
    departureDate?: Date,
  ): Promise<Flight[]>;
  search(criteria: FlightSearchCriteria): Promise<Flight[]>;
}
