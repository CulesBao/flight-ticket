import { Module } from '@nestjs/common';
import { SeatController } from './presentation';
import { SeatService, SEAT_TOKENS } from './application';
import { InMemorySeatRepository } from './infrastructure';
import { SEAT_REPOSITORY } from './domain';

@Module({
  controllers: [SeatController],
  providers: [
    {
      provide: SEAT_TOKENS.SEAT_SERVICE,
      useClass: SeatService,
    },
    {
      provide: SEAT_REPOSITORY,
      useClass: InMemorySeatRepository,
    },
  ],
  exports: [SEAT_TOKENS.SEAT_SERVICE],
})
export class SeatModule {}
