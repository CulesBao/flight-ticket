import { BaseEntity } from '../../../shared/domain';
import { UserEmail, PhoneNumber } from './user.value-objects';
import { UserStatus, UserRole } from './user.enums';

export class User extends BaseEntity {
  constructor(
    id: string,
    public readonly email: UserEmail,
    public firstName: string,
    public lastName: string,
    public phoneNumber?: PhoneNumber,
    public dateOfBirth?: Date,
    public status: UserStatus = UserStatus.ACTIVE,
    public role: UserRole = UserRole.CUSTOMER,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {
    super(id);
  }

  static create(data: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    role?: UserRole;
  }): User {
    const userEmail = new UserEmail(data.email);
    const phoneNumber = data.phoneNumber
      ? new PhoneNumber(data.phoneNumber)
      : undefined;
    const id =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    return new User(
      id,
      userEmail,
      data.firstName,
      data.lastName,
      phoneNumber,
      data.dateOfBirth,
      UserStatus.ACTIVE,
      data.role || UserRole.CUSTOMER,
    );
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Business methods
  updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
  }): void {
    if (data.firstName) this.firstName = data.firstName;
    if (data.lastName) this.lastName = data.lastName;
    if (data.phoneNumber) this.phoneNumber = new PhoneNumber(data.phoneNumber);
    if (data.dateOfBirth) this.dateOfBirth = data.dateOfBirth;
    this.updatedAt = new Date();
  }

  suspend(): void {
    this.status = UserStatus.SUSPENDED;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.status = UserStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.status = UserStatus.INACTIVE;
    this.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
