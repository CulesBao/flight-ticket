import { Module } from '@nestjs/common';
import { AirportModule, FlightModule, UserModule } from './modules';
import { RedisModule, RedlockModule } from './infrastructure';

@Module({
  imports: [
    RedisModule,
    RedlockModule,
    AirportModule,
    FlightModule,
    UserModule,
  ],
})
export class AppModule {}
