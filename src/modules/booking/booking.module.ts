import { Module } from '@nestjs/common';
import { BookingService, BOOKING_TOKENS } from './application';
import { InMemoryBookingRepository } from './infrastructure';
import { BOOKING_REPOSITORY } from './domain';

@Module({
  providers: [
    {
      provide: BOOKING_TOKENS.BOOKING_SERVICE,
      useClass: BookingService,
    },
    {
      provide: BOOKING_REPOSITORY,
      useClass: InMemoryBookingRepository,
    },
  ],
  exports: [BOOKING_TOKENS.BOOKING_SERVICE],
})
export class BookingModule {}
