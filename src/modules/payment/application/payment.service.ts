import { Injectable, Inject } from '@nestjs/common';
import {
  Payment,
  PaymentRepository,
  PAYMENT_REPOSITORY,
  PaymentStatus,
  PaymentMethod,
} from '../domain';
import { PaginationOptions, PaginatedResult } from '../../../shared/domain';
import { Money } from '../../../shared/domain/value-objects';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async findAll(
    options?: PaginationOptions,
  ): Promise<PaginatedResult<Payment>> {
    return this.paymentRepository.findAll(options);
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  async findByBookingId(bookingId: string): Promise<Payment[]> {
    return this.paymentRepository.findByBookingId(bookingId);
  }

  async findByTransactionId(transactionId: string): Promise<Payment> {
    const payment =
      await this.paymentRepository.findByTransactionId(transactionId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return payment;
  }

  async findByStatus(
    status: PaymentStatus,
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<Payment>> {
    return this.paymentRepository.findByStatus(status, pagination);
  }

  async createPayment(data: {
    bookingId: string;
    amount: { amount: number; currency: string };
    method: PaymentMethod;
    gateway?: string;
  }): Promise<Payment> {
    const amountMoney = new Money(data.amount.amount, data.amount.currency);

    const payment = Payment.create({
      bookingId: data.bookingId,
      amount: amountMoney,
      method: data.method,
      gateway: data.gateway,
    });

    return this.paymentRepository.save(payment);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async processPayment(id: string, transactionId: string): Promise<Payment> {
    const payment = await this.findById(id);
    payment.process();
    return this.paymentRepository.save(payment);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async completePayment(id: string, transactionId: string): Promise<Payment> {
    const payment = await this.findById(id);
    payment.complete();
    return this.paymentRepository.save(payment);
  }

  async failPayment(id: string): Promise<Payment> {
    const payment = await this.findById(id);
    payment.fail();
    return this.paymentRepository.save(payment);
  }

  async refundPayment(id: string): Promise<Payment> {
    const payment = await this.findById(id);
    payment.refund();
    return this.paymentRepository.save(payment);
  }

  async getPaymentStatistics(): Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    refunded: number;
    totalAmount: { amount: number; currency: string };
  }> {
    const allPayments = await this.paymentRepository.findAll();
    const payments = allPayments.data;

    const completedPayments = payments.filter((p) => p.isCompleted());
    const totalAmount = completedPayments.reduce(
      (sum, payment) => sum + payment.amount.amount,
      0,
    );

    return {
      total: payments.length,
      pending: payments.filter((p) => p.isPending()).length,
      completed: completedPayments.length,
      failed: payments.filter((p) => p.isFailed()).length,
      refunded: payments.filter((p) => p.isRefunded()).length,
      totalAmount: { amount: totalAmount, currency: 'USD' },
    };
  }
}
