import { Module } from '@nestjs/common';
import { AirportsController } from 'src/api';
import { GetAirportByCodeUseCase } from './index';
import { GetAllAirportsUseCase } from './index';
import { InMemoryAirportRepository, RedlockModule } from 'src/infra';
import { AIRPORT_TOKENS } from './airports.tokens';

@Module({
  controllers: [AirportsController],
  providers: [
    // Repository implementation
    {
      provide: AIRPORT_TOKENS.AIRPORT_REPOSITORY,
      useClass: InMemoryAirportRepository,
    },
    // Use cases
    GetAirportByCodeUseCase,
    GetAllAirportsUseCase,
  ],
  exports: [
    AIRPORT_TOKENS.AIRPORT_REPOSITORY,
    GetAirportByCodeUseCase,
    GetAllAirportsUseCase,
  ],
  imports: [RedlockModule],
})
export class AirportsModule {}
