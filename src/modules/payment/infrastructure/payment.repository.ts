import { Injectable } from '@nestjs/common';
import { InMemoryRepository } from '../../../shared/infrastructure';
import {
  Payment,
  PaymentRepository,
  PaymentStatus,
  PaymentMethod,
} from '../domain';
import { PaginatedResult } from '../../../shared/domain';
import { Money } from '../../../shared/domain/value-objects';

@Injectable()
export class InMemoryPaymentRepository
  extends InMemoryRepository<Payment>
  implements PaymentRepository
{
  constructor() {
    super();
    this.seedData();
  }

  protected getEntityId(entity: Payment): string {
    return entity.id;
  }

  findByBookingId(bookingId: string): Promise<Payment[]> {
    const payments = this.items.filter(
      (payment) => payment.bookingId === bookingId,
    );
    return Promise.resolve(payments);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findByStatus(
    status: string,
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<Payment>> {
    const filteredPayments = this.items.filter(
      (payment) => payment.status === (status as PaymentStatus),
    );
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

    return {
      data: paginatedPayments,
      total: filteredPayments.length,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(filteredPayments.length / pagination.limit),
    };
  }

  findByTransactionId(transactionId: string): Promise<Payment | null> {
    const payment =
      this.items.find((payment) => payment.transactionId === transactionId) ||
      null;
    return Promise.resolve(payment);
  }

  private seedData(): void {
    const payments = [
      Payment.create({
        bookingId: 'booking-1',
        amount: new Money(299.99, 'USD'),
        method: PaymentMethod.CREDIT_CARD,
        gateway: 'stripe',
      }),
      Payment.create({
        bookingId: 'booking-2',
        amount: new Money(549.98, 'USD'),
        method: PaymentMethod.DEBIT_CARD,
        gateway: 'paypal',
      }),
    ];

    // Complete first payment
    payments[0].process();
    payments[0].complete();

    payments.forEach((payment) => this.items.push(payment));
  }
}
