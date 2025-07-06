import { Injectable } from '@nestjs/common';
import { FlightEntity, FlightRepository } from 'src/domain/flights';

@Injectable()
export class InMemoryFlightRepository implements FlightRepository {
  private flights: FlightEntity[] = [];

  findById(id: string): FlightEntity | null {
    return this.flights.find((f) => f.id === id) || null;
  }

  findAll(): FlightEntity[] {
    return [...this.flights];
  }

  save(flight: FlightEntity): void {
    const idx = this.flights.findIndex((f) => f.id === flight.id);
    if (idx !== -1) {
      this.flights[idx] = flight;
    } else {
      this.flights.push(flight);
    }
  }

  delete(id: string): void {
    this.flights = this.flights.filter((f) => f.id !== id);
  }
}
