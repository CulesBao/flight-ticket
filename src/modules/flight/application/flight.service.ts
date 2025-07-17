import { Injectable, Inject } from '@nestjs/common';
import {
  FlightRepository,
  Flight,
  FlightNotFoundError,
  FlightSearchCriteria,
  FlightStatus,
} from '../domain';
import { PaginationOptions, PaginatedResult } from '../../../shared/domain';
import { FLIGHT_TOKENS } from './flight.tokens';

@Injectable()
export class FlightService {
  constructor(
    @Inject(FLIGHT_TOKENS.FLIGHT_REPOSITORY)
    private readonly flightRepository: FlightRepository,
  ) {}

  async findById(id: string): Promise<Flight> {
    const flight = await this.flightRepository.findById(id);

    if (!flight) {
      throw new FlightNotFoundError(id);
    }

    return flight;
  }

  async findByFlightNumber(flightNumber: string): Promise<Flight> {
    const flight = await this.flightRepository.findByFlightNumber(flightNumber);

    if (!flight) {
      throw new FlightNotFoundError(flightNumber);
    }

    return flight;
  }

  async searchFlights(criteria: FlightSearchCriteria): Promise<Flight[]> {
    return this.flightRepository.search(criteria);
  }

  async findByRoute(
    departureAirport: string,
    arrivalAirport: string,
    departureDate?: Date,
  ): Promise<Flight[]> {
    return this.flightRepository.findByRoute(
      departureAirport,
      arrivalAirport,
      departureDate,
    );
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Flight>> {
    return this.flightRepository.findAll(options);
  }

  async updateFlightStatus(
    flightId: string,
    status: FlightStatus,
  ): Promise<Flight> {
    const flight = await this.findById(flightId);

    flight.updateStatus(status);
    return this.flightRepository.save(flight);
  }

  async save(flight: Flight): Promise<Flight> {
    return this.flightRepository.save(flight);
  }

  async delete(id: string): Promise<void> {
    await this.flightRepository.delete(id);
  }
}
