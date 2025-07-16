import { Module } from '@nestjs/common';
import { AirportModule, FlightModule } from './modules';
import { RedisModule, RedlockModule } from './infrastructure';

@Module({
  imports: [RedisModule, RedlockModule, AirportModule, FlightModule],
})
export class AppModule {}
