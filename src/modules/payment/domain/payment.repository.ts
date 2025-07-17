import { Repository } from '../../../shared/application';
import { PaginatedResult } from '../../../shared/domain';
import { Payment } from './payment.entity';

export interface PaymentRepository extends Repository<Payment> {
  findByBookingId(bookingId: string): Promise<Payment[]>;
  findByStatus(
    status: string,
    pagination: { page: number; limit: number },
  ): Promise<PaginatedResult<Payment>>;
  findByTransactionId(transactionId: string): Promise<Payment | null>;
}

export const PAYMENT_REPOSITORY = 'PAYMENT_REPOSITORY';
