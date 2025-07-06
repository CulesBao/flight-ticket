import { Injectable } from '@nestjs/common';
import {
  PaymentEntity,
  PaymentRepository,
  PaymentStatus,
  PaymentMethod,
} from 'src/domain/payments';

@Injectable()
export class InMemoryPaymentRepository implements PaymentRepository {
  private payments: PaymentEntity[] = [
    new PaymentEntity(
      'payment-1',
      'booking-1',
      200,
      'USD',
      PaymentMethod.CREDIT_CARD,
      PaymentStatus.COMPLETED,
      'txn-123',
      'ext-123',
      new Date('2024-06-01T10:10:00Z'),
      new Date('2024-06-01T10:11:00Z'),
      undefined,
      undefined,
      undefined,
      { note: 'Paid in full' },
    ),
    new PaymentEntity(
      'payment-2',
      'booking-2',
      120,
      'USD',
      PaymentMethod.PAYPAL,
      PaymentStatus.PENDING,
      undefined,
      undefined,
      new Date('2024-06-02T09:10:00Z'),
      undefined,
      undefined,
      undefined,
      undefined,
      { note: 'Awaiting payment' },
    ),
  ];

  findById(id: string): PaymentEntity | null {
    return this.payments.find((p) => p.id === id) || null;
  }

  findAll(): PaymentEntity[] {
    return [...this.payments];
  }

  save(payment: PaymentEntity): void {
    const idx = this.payments.findIndex((p) => p.id === payment.id);
    if (idx !== -1) {
      this.payments[idx] = payment;
    } else {
      this.payments.push(payment);
    }
  }

  delete(id: string): void {
    this.payments = this.payments.filter((p) => p.id !== id);
  }
}
