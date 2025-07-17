import { Injectable } from '@nestjs/common';
import { InMemoryRepository } from '../../../shared/infrastructure';
import { User, UserRepository, UserEmail, UserRole } from '../domain';
import { PaginatedResult } from '../../../shared/domain';

@Injectable()
export class InMemoryUserRepository
  extends InMemoryRepository<User>
  implements UserRepository
{
  constructor() {
    super();
    this.seedData();
  }

  protected getEntityId(entity: User): string {
    return entity.id;
  }

  findByEmail(email: UserEmail): Promise<User | null> {
    const user = this.items.find((user) => user.email.equals(email)) || null;
    return Promise.resolve(user);
  }

  findByEmailString(email: string): Promise<User | null> {
    const user =
      this.items.find((user) => user.email.toString() === email) || null;
    return Promise.resolve(user);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async findActiveUsers(pagination: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<User>> {
    const activeUsers = this.items.filter((user) => user.isActive());
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedUsers = activeUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      total: activeUsers.length,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(activeUsers.length / pagination.limit),
    };
  }

  private seedData(): void {
    const users = [
      User.create({
        email: 'admin@flightbooking.com',
        firstName: 'System',
        lastName: 'Administrator',
        phoneNumber: '+84901234567',
        role: UserRole.ADMIN,
      }),
      User.create({
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+84987654321',
        dateOfBirth: new Date('1985-06-15'),
      }),
      User.create({
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '+84912345678',
        dateOfBirth: new Date('1990-03-22'),
      }),
      User.create({
        email: 'agent@flightbooking.com',
        firstName: 'Travel',
        lastName: 'Agent',
        phoneNumber: '+84923456789',
        role: UserRole.AGENT,
      }),
    ];

    users.forEach((user) => this.items.push(user));
  }
}
