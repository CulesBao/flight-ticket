import { Module } from '@nestjs/common';
import { FlightController } from './presentation';
import { FlightService, FLIGHT_TOKENS } from './application';
import { InMemoryFlightRepository } from './infrastructure';
import { FLIGHT_REPOSITORY } from './domain';

@Module({
  controllers: [FlightController],
  providers: [
    {
      provide: FLIGHT_TOKENS.FLIGHT_SERVICE,
      useClass: FlightService,
    },
    {
      provide: FLIGHT_REPOSITORY,
      useClass: InMemoryFlightRepository,
    },
  ],
  exports: [FLIGHT_TOKENS.FLIGHT_SERVICE],
})
export class FlightModule {}
