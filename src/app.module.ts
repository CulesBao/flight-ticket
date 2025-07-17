import { Module } from '@nestjs/common';
import { AirportModule, FlightModule, UserModule, SeatModule } from './modules';
import { RedisModule, RedlockModule } from './infrastructure';

@Module({
  imports: [
    RedisModule,
    RedlockModule,
    AirportModule,
    FlightModule,
    UserModule,
    SeatModule,
  ],
})
export class AppModule {}
