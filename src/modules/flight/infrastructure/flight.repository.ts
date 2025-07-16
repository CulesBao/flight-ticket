import { Injectable } from '@nestjs/common';
import { InMemoryRepository } from '../../../shared/infrastructure';
import { FlightRepository, Flight, FlightSearchCriteria } from '../domain';
import { AircraftType, FlightStatus } from '../domain/flight.enums';

@Injectable()
export class InMemoryFlightRepository
  extends InMemoryRepository<Flight>
  implements FlightRepository
{
  constructor() {
    super();
    this.seedData();
  }

  async findByFlightNumber(flightNumber: string): Promise<Flight | null> {
    return (
      this.items.find(
        (flight) => flight.flightNumber.value === flightNumber.toUpperCase(),
      ) || null
    );
  }

  async findByRoute(
    departureAirport: string,
    arrivalAirport: string,
    departureDate?: Date,
  ): Promise<Flight[]> {
    return this.items.filter((flight) => {
      const matchesRoute =
        flight.departureAirport === departureAirport.toUpperCase() &&
        flight.arrivalAirport === arrivalAirport.toUpperCase();

      if (!departureDate) {
        return matchesRoute;
      }

      const flightDate = new Date(flight.departureTime);
      const searchDate = new Date(departureDate);

      return (
        matchesRoute && flightDate.toDateString() === searchDate.toDateString()
      );
    });
  }

  async search(criteria: FlightSearchCriteria): Promise<Flight[]> {
    return this.items.filter((flight) => {
      if (
        criteria.departureAirport &&
        flight.departureAirport !== criteria.departureAirport.toUpperCase()
      ) {
        return false;
      }

      if (
        criteria.arrivalAirport &&
        flight.arrivalAirport !== criteria.arrivalAirport.toUpperCase()
      ) {
        return false;
      }

      if (criteria.departureDate) {
        const flightDate = new Date(flight.departureTime);
        const searchDate = new Date(criteria.departureDate);
        if (flightDate.toDateString() !== searchDate.toDateString()) {
          return false;
        }
      }

      if (criteria.minPrice && flight.basePrice.amount < criteria.minPrice) {
        return false;
      }

      if (criteria.maxPrice && flight.basePrice.amount > criteria.maxPrice) {
        return false;
      }

      return true;
    });
  }

  protected getEntityId(entity: Flight): string {
    return entity.id;
  }

  private seedData(): void {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const flights = [
      Flight.create(
        'VN123',
        'SGN',
        'HAN',
        new Date(tomorrow.getTime()),
        new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // +2 hours
        AircraftType.AIRBUS_A320,
        2500000,
        'VND',
        180,
      ),
      Flight.create(
        'VN456',
        'HAN',
        'SGN',
        new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000), // +4 hours
        new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000), // +6 hours
        AircraftType.BOEING_737,
        2300000,
        'VND',
        160,
      ),
      Flight.create(
        'QR789',
        'SGN',
        'DOH',
        new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000), // +8 hours
        new Date(tomorrow.getTime() + 16 * 60 * 60 * 1000), // +16 hours
        AircraftType.BOEING_777,
        15000000,
        'VND',
        300,
      ),
    ];

    this.items = flights;
  }
}
