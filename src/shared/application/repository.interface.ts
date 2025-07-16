import { PaginationOptions, PaginatedResult } from '../domain';

export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<T>>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
