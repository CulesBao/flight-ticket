import { Injectable } from '@nestjs/common';
import { InMemoryRepository } from '../../../shared/infrastructure';
import { AirportRepository, Airport } from '../domain';

@Injectable()
export class InMemoryAirportRepository
  extends InMemoryRepository<Airport>
  implements AirportRepository
{
  constructor() {
    super();
    this.seedData();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByCode(code: string): Promise<Airport | null> {
    return (
      this.items.find((airport) => airport.code.value === code.toUpperCase()) ||
      null
    );
  }

  protected getEntityId(entity: Airport): string {
    return entity.id;
  }

  private seedData(): void {
    const airports = [
      Airport.create(
        'SGN',
        'Tan Son Nhat International Airport',
        'Tan Son Nhat',
        'Ho Chi Minh City',
        'Vietnam',
      ),
      Airport.create(
        'HAN',
        'Noi Bai International Airport',
        'Noi Bai',
        'Hanoi',
        'Vietnam',
      ),
      Airport.create(
        'DAD',
        'Da Nang International Airport',
        'Da Nang',
        'Da Nang',
        'Vietnam',
      ),
      Airport.create(
        'NRT',
        'Narita International Airport',
        'Narita',
        'Tokyo',
        'Japan',
      ),
      Airport.create(
        'ICN',
        'Incheon International Airport',
        'Incheon',
        'Seoul',
        'South Korea',
      ),
    ];

    this.items = airports;
  }
}
