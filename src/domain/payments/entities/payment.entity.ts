export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
}

export interface Payment {
  readonly id: string;
  readonly bookingId: string;
  readonly amount: number;
  readonly currency: string;
  readonly method: PaymentMethod;
  readonly status: PaymentStatus;
  readonly transactionId?: string;
  readonly externalPaymentId?: string;
  readonly createdAt: Date;
  readonly completedAt?: Date;
  readonly failedAt?: Date;
  readonly refundedAt?: Date;
  readonly failureReason?: string;
  readonly metadata?: Record<string, any>;
}

export class PaymentEntity implements Payment {
  constructor(
    public readonly id: string,
    public readonly bookingId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly method: PaymentMethod,
    public readonly status: PaymentStatus,
    public readonly transactionId?: string,
    public readonly externalPaymentId?: string,
    public readonly createdAt: Date = new Date(),
    public readonly completedAt?: Date,
    public readonly failedAt?: Date,
    public readonly refundedAt?: Date,
    public readonly failureReason?: string,
    public readonly metadata?: Record<string, any>,
  ) {
    this.validateAmount(amount);
    this.validateCurrency(currency);
    this.validateBookingId(bookingId);
  }

  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error('Payment amount must be positive');
    }
    if (Math.round(amount * 100) !== amount * 100) {
      throw new Error('Payment amount cannot have more than 2 decimal places');
    }
  }

  private validateCurrency(currency: string): void {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'VND'];
    if (!validCurrencies.includes(currency)) {
      throw new Error(`Invalid currency: ${currency}`);
    }
  }

  private validateBookingId(bookingId: string): void {
    if (!bookingId || bookingId.trim().length === 0) {
      throw new Error('Booking ID is required');
    }
  }

  canBeProcessed(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  canBeCancelled(): boolean {
    return (
      this.status === PaymentStatus.PENDING ||
      this.status === PaymentStatus.PROCESSING
    );
  }

  canBeRefunded(): boolean {
    return this.status === PaymentStatus.COMPLETED;
  }

  startProcessing(): PaymentEntity {
    if (!this.canBeProcessed()) {
      throw new Error('Payment cannot be processed');
    }

    return new PaymentEntity(
      this.id,
      this.bookingId,
      this.amount,
      this.currency,
      this.method,
      PaymentStatus.PROCESSING,
      this.transactionId,
      this.externalPaymentId,
      this.createdAt,
      this.completedAt,
      this.failedAt,
      this.refundedAt,
      this.failureReason,
      this.metadata,
    );
  }

  complete(transactionId: string, externalPaymentId?: string): PaymentEntity {
    if (this.status !== PaymentStatus.PROCESSING) {
      throw new Error('Only processing payments can be completed');
    }

    return new PaymentEntity(
      this.id,
      this.bookingId,
      this.amount,
      this.currency,
      this.method,
      PaymentStatus.COMPLETED,
      transactionId,
      externalPaymentId,
      this.createdAt,
      new Date(),
      this.failedAt,
      this.refundedAt,
      this.failureReason,
      this.metadata,
    );
  }

  fail(reason: string): PaymentEntity {
    if (this.status !== PaymentStatus.PROCESSING) {
      throw new Error('Only processing payments can be failed');
    }

    return new PaymentEntity(
      this.id,
      this.bookingId,
      this.amount,
      this.currency,
      this.method,
      PaymentStatus.FAILED,
      this.transactionId,
      this.externalPaymentId,
      this.createdAt,
      this.completedAt,
      new Date(),
      this.refundedAt,
      reason,
      this.metadata,
    );
  }

  cancel(): PaymentEntity {
    if (!this.canBeCancelled()) {
      throw new Error('Payment cannot be cancelled');
    }

    return new PaymentEntity(
      this.id,
      this.bookingId,
      this.amount,
      this.currency,
      this.method,
      PaymentStatus.CANCELLED,
      this.transactionId,
      this.externalPaymentId,
      this.createdAt,
      this.completedAt,
      this.failedAt,
      this.refundedAt,
      this.failureReason,
      this.metadata,
    );
  }

  refund(): PaymentEntity {
    if (!this.canBeRefunded()) {
      throw new Error('Payment cannot be refunded');
    }

    return new PaymentEntity(
      this.id,
      this.bookingId,
      this.amount,
      this.currency,
      this.method,
      PaymentStatus.REFUNDED,
      this.transactionId,
      this.externalPaymentId,
      this.createdAt,
      this.completedAt,
      this.failedAt,
      new Date(),
      this.failureReason,
      this.metadata,
    );
  }
}
