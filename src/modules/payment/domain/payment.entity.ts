import { BaseEntity } from '../../../shared/domain';
import { PaymentStatus, PaymentMethod } from './payment.enums';
import { Money } from '../../../shared/domain/value-objects';

export class Payment extends BaseEntity {
  constructor(
    id: string,
    public readonly bookingId: string,
    public readonly amount: Money,
    public readonly method: PaymentMethod,
    public status: PaymentStatus = PaymentStatus.PENDING,
    public readonly transactionId?: string,
    public readonly gateway?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public completedAt?: Date,
  ) {
    super(id);
  }

  static create(data: {
    bookingId: string;
    amount: Money;
    method: PaymentMethod;
    gateway?: string;
  }): Payment {
    const id =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    return new Payment(
      id,
      data.bookingId,
      data.amount,
      data.method,
      PaymentStatus.PENDING,
      undefined,
      data.gateway,
    );
  }

  process(): void {
    if (this.status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be processed');
    }
    this.status = PaymentStatus.PROCESSING;
    this.updatedAt = new Date();
  }

  complete(): void {
    if (this.status !== PaymentStatus.PROCESSING) {
      throw new Error('Only processing payments can be completed');
    }
    this.status = PaymentStatus.COMPLETED;
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  fail(): void {
    if (
      this.status === PaymentStatus.COMPLETED ||
      this.status === PaymentStatus.REFUNDED
    ) {
      throw new Error('Cannot fail completed or refunded payment');
    }
    this.status = PaymentStatus.FAILED;
    this.updatedAt = new Date();
  }

  refund(): void {
    if (this.status !== PaymentStatus.COMPLETED) {
      throw new Error('Only completed payments can be refunded');
    }
    this.status = PaymentStatus.REFUNDED;
    this.updatedAt = new Date();
  }

  isCompleted(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }

  isRefunded(): boolean {
    return this.status === PaymentStatus.REFUNDED;
  }
}
