import { Module } from '@nestjs/common';
import { AirportsModule } from './app/airports';

@Module({
  imports: [AirportsModule],
})
export class AppModule {}
