import { Module } from '@nestjs/common';
import { AirportsModule } from './app/airports';
import { RedisModule } from './infra/redis/redis.module';

@Module({
  imports: [AirportsModule, RedisModule],
})
export class AppModule {}
