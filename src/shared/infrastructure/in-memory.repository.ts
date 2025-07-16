import { Injectable } from '@nestjs/common';
import { Repository } from '../application';
import { PaginationOptions, PaginatedResult } from '../domain';

@Injectable()
export abstract class InMemoryRepository<T> implements Repository<T> {
  protected items: T[] = [];

  // eslint-disable-next-line @typescript-eslint/require-await
  async findById(id: string): Promise<T | null> {
    return this.items.find((item) => this.getEntityId(item) === id) || null;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findAll(options?: PaginationOptions): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sortBy, sortOrder = 'ASC' } = options || {};

    const sortedItems = [...this.items];

    if (sortBy) {
      sortedItems.sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const aValue = (a as any)[sortBy];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const bValue = (b as any)[sortBy];

        if (sortOrder === 'DESC') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = sortedItems.slice(startIndex, endIndex);

    return {
      data,
      total: this.items.length,
      page,
      limit,
      totalPages: Math.ceil(this.items.length / limit),
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async save(entity: T): Promise<T> {
    const id = this.getEntityId(entity);
    const existingIndex = this.items.findIndex(
      (item) => this.getEntityId(item) === id,
    );

    if (existingIndex >= 0) {
      this.items[existingIndex] = entity;
    } else {
      this.items.push(entity);
    }

    return entity;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => this.getEntityId(item) === id);
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  protected abstract getEntityId(entity: T): string;
}
