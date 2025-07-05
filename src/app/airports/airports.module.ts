import { Module } from '@nestjs/common';
import { AirportsController } from '../../api/airports/airports.controller';
import { GetAirportByCodeUseCase } from './use-cases/get-airport-by-code.use-case';
import { GetAllAirportsUseCase } from './use-cases/get-all-airports.use-case';
import { InMemoryAirportRepository } from '../../infra/airports/repositories/in-memory-airport.repository';

// Token cho dependency injection
export const AIRPORT_REPOSITORY_TOKEN = 'AIRPORT_REPOSITORY';

@Module({
  controllers: [AirportsController],
  providers: [
    // Repository implementation
    {
      provide: AIRPORT_REPOSITORY_TOKEN,
      useClass: InMemoryAirportRepository,
    },
    // Use cases
    GetAirportByCodeUseCase,
    GetAllAirportsUseCase,
  ],
  exports: [
    AIRPORT_REPOSITORY_TOKEN,
    GetAirportByCodeUseCase,
    GetAllAirportsUseCase,
  ],
})
export class AirportsModule {}
