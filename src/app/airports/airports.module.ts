import { Module } from '@nestjs/common';
import { AirportsController } from 'src/api';
import { GetAirportByCodeUseCase } from './index';
import { GetAllAirportsUseCase } from './index';
import { InMemoryAirportRepository, RedlockModule } from 'src/infra';

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
  imports: [RedlockModule],
})
export class AirportsModule {}
