import { Module } from '@nestjs/common';
import { PaymentService, PAYMENT_TOKENS } from './application';
import { InMemoryPaymentRepository } from './infrastructure';
import { PAYMENT_REPOSITORY } from './domain';

@Module({
  providers: [
    {
      provide: PAYMENT_TOKENS.PAYMENT_SERVICE,
      useClass: PaymentService,
    },
    {
      provide: PAYMENT_REPOSITORY,
      useClass: InMemoryPaymentRepository,
    },
  ],
  exports: [PAYMENT_TOKENS.PAYMENT_SERVICE],
})
export class PaymentModule {}
