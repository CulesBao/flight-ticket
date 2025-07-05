import { Injectable, Inject } from '@nestjs/common';
import { AirportEntity, AirportRepository } from '../../../domain/airports';

@Injectable()
export class GetAllAirportsUseCase {
  constructor(
    @Inject('AIRPORT_REPOSITORY')
    private readonly airportRepository: AirportRepository,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(): Promise<AirportEntity[]> {
    return this.airportRepository.findAll();
  }
}
