import { Repository } from '../../../shared/application';
import { PaginatedResult } from '../../../shared/domain';
import { User } from './user.entity';
import { UserEmail } from './user.value-objects';

export interface UserRepository extends Repository<User> {
  findByEmail(email: UserEmail): Promise<User | null>;
  findByEmailString(email: string): Promise<User | null>;
  findActiveUsers(pagination: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<User>>;
}

export const USER_REPOSITORY = 'USER_REPOSITORY';
