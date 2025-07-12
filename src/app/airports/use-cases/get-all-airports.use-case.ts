import { Injectable, Inject } from '@nestjs/common';
import { AirportEntity, AirportRepository } from '../../../domain/airports';
import { AIRPORT_TOKENS } from '../airports.tokens';

@Injectable()
export class GetAllAirportsUseCase {
  constructor(
    @Inject(AIRPORT_TOKENS.AIRPORT_REPOSITORY)
    private readonly airportRepository: AirportRepository,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async execute(): Promise<AirportEntity[]> {
    return this.airportRepository.findAll();
  }
}
