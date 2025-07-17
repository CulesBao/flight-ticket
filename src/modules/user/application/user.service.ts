import { Injectable, Inject } from '@nestjs/common';
import { User, UserRepository, USER_REPOSITORY, UserRole } from '../domain';
import { PaginationOptions, PaginatedResult } from '../../../shared/domain';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(options);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmailString(email);
  }

  async createUser(data: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    role?: UserRole;
  }): Promise<User> {
    // Check if user already exists
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = User.create(data);
    return this.userRepository.save(user);
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      dateOfBirth?: Date;
    },
  ): Promise<User> {
    const user = await this.findById(userId);
    user.updateProfile(data);
    return this.userRepository.save(user);
  }

  async suspendUser(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.suspend();
    return this.userRepository.save(user);
  }

  async activateUser(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.activate();
    return this.userRepository.save(user);
  }

  async deactivateUser(userId: string): Promise<User> {
    const user = await this.findById(userId);
    user.deactivate();
    return this.userRepository.save(user);
  }

  async getActiveUsers(pagination: {
    page: number;
    limit: number;
  }): Promise<PaginatedResult<User>> {
    return this.userRepository.findActiveUsers(pagination);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.findById(userId);
    await this.userRepository.delete(user.id);
  }
}
