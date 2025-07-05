import { Injectable, Inject } from '@nestjs/common';
import {
  AirportRepository,
  AirportEntity,
  AirportNotFoundError,
} from '../../../domain/airports';

@Injectable()
export class GetAirportByCodeUseCase {
  constructor(
    @Inject('AIRPORT_REPOSITORY')
    private readonly airportRepository: AirportRepository,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(airportCode: string): Promise<AirportEntity> {
    const airport = this.airportRepository.findByCode(
      airportCode.toUpperCase(),
    );

    if (!airport) {
      throw new AirportNotFoundError(airportCode);
    }

    return airport;
  }
}
