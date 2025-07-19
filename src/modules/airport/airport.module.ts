import { Module } from '@nestjs/common';
import { AirportService, AIRPORT_TOKENS } from './application';
import { InMemoryAirportRepository } from './infrastructure';
import { AirportController } from './presentation';
import { RedisModule, RedlockModule } from 'src/infrastructure';

@Module({
  controllers: [AirportController],
  providers: [
    // Repository implementation
    {
      provide: AIRPORT_TOKENS.AIRPORT_REPOSITORY,
      useClass: InMemoryAirportRepository,
    },
    // Service
    {
      provide: AIRPORT_TOKENS.AIRPORT_SERVICE,
      useClass: AirportService,
    },
  ],
  exports: [AIRPORT_TOKENS.AIRPORT_REPOSITORY, AIRPORT_TOKENS.AIRPORT_SERVICE],
  imports: [RedisModule, RedlockModule],
})
export class AirportModule {}
