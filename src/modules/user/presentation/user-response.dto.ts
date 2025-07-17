export class UserResponseDto {
  id: string;

  email: string;

  firstName: string;

  lastName: string;

  fullName: string;

  phoneNumber?: string;

  dateOfBirth?: Date;

  status: string;

  role: string;

  createdAt: Date;

  updatedAt: Date;
}
