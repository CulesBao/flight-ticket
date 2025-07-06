import { Module } from '@nestjs/common';
import { RedLockConfig } from './config/redlock.config';
import { RedlockService } from './service/redlock.service';

@Module({
  providers: [
    {
      provide: 'REDLOCK_INSTANCE',
      useClass: RedLockConfig,
    },
    {
      provide: 'REDLOCK_SERVICE',
      useClass: RedlockService,
    },
  ],
  exports: ['REDLOCK_INSTANCE', 'REDLOCK_SERVICE'],
})
export class RedlockModule {}
