import { PaymentEntity } from '../entities/payment.entity';

export interface PaymentRepository {
  findById(id: string): PaymentEntity | null;
  findAll(): PaymentEntity[];
  save(payment: PaymentEntity): void;
  delete(id: string): void;
}
