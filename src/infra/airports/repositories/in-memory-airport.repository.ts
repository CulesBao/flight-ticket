import { Injectable } from '@nestjs/common';
import { AirportRepository, AirportEntity } from 'src/domain/airports';

@Injectable()
export class InMemoryAirportRepository implements AirportRepository {
  private readonly airports: AirportEntity[] = [
    new AirportEntity(
      'ATL',
      'Hartsfield–Jackson Atlanta International Airport',
      'Atlanta',
      'Atlanta',
      'United States',
    ),
    new AirportEntity(
      'LAX',
      'Los Angeles International Airport',
      'Los Angeles',
      'Los Angeles',
      'United States',
    ),
    new AirportEntity(
      'ORD',
      "O'Hare International Airport",
      "Chicago O'Hare",
      'Chicago',
      'United States',
    ),
    new AirportEntity(
      'DFW',
      'Dallas/Fort Worth International Airport',
      'Dallas/Fort Worth',
      'Dallas/Fort Worth',
      'United States',
    ),
  ];

  findByCode(airportCode: string): AirportEntity | null {
    const airport = this.airports.find(
      (airport) => airport.airportCode === airportCode.toUpperCase(),
    );
    return airport || null;
  }

  findAll(): AirportEntity[] {
    return [...this.airports];
  }

  save(airport: AirportEntity): void {
    const existingIndex = this.airports.findIndex(
      (a) => a.airportCode === airport.airportCode,
    );

    if (existingIndex !== -1) {
      this.airports[existingIndex] = airport;
    } else {
      this.airports.push(airport);
    }
  }

  delete(airportCode: string): void {
    const index = this.airports.findIndex(
      (a) => a.airportCode === airportCode.toUpperCase(),
    );

    if (index !== -1) {
      this.airports.splice(index, 1);
    }
  }
}
