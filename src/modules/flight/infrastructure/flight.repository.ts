import { Injectable } from '@nestjs/common';
import { InMemoryRepository } from '../../../shared/infrastructure';
import { FlightRepository, Flight, FlightSearchCriteria } from '../domain';
import { AircraftType } from '../domain/flight.enums';

@Injectable()
export class InMemoryFlightRepository
  extends InMemoryRepository<Flight>
  implements FlightRepository
{
  constructor() {
    super();
    this.seedData();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByFlightNumber(flightNumber: string): Promise<Flight | null> {
    return (
      this.items.find(
        (flight) => flight.flightNumber.value === flightNumber.toUpperCase(),
      ) || null
    );
  }

  // eslint-disable-next-line @typescript-eslint/require-await
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

  // eslint-disable-next-line @typescript-eslint/require-await
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

    const sampleFlights = [
      Flight.create(
        'VJ101',
        'SGN',
        'HAN',
        new Date('2025-07-17T06:00:00Z'),
        new Date('2025-07-17T08:30:00Z'),
        AircraftType.AIRBUS_A320,
        1500000,
        'VND',
      ),
      Flight.create(
        'VN202',
        'HAN',
        'SGN',
        new Date('2025-07-17T14:00:00Z'),
        new Date('2025-07-17T16:15:00Z'),
        AircraftType.BOEING_737,
        1800000,
        'VND',
      ),
      Flight.create(
        'QH301',
        'SGN',
        'DAD',
        new Date('2025-07-17T09:00:00Z'),
        new Date('2025-07-17T10:30:00Z'),
        AircraftType.BOEING_787,
        2500000,
        'VND',
      ),
    ];

    this.items = sampleFlights;
  }
}
