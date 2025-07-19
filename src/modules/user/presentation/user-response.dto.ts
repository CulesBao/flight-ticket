import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '1', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  lastName: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  fullName: string;

  @ApiProperty({
    example: '+84987654321',
    required: false,
    description: 'Phone number',
  })
  phoneNumber?: string;

  @ApiProperty({
    example: '1985-06-15T00:00:00.000Z',
    required: false,
    description: 'Date of birth',
  })
  dateOfBirth?: Date;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'inactive', 'suspended'],
    description: 'User status',
  })
  status: string;

  @ApiProperty({
    example: 'customer',
    enum: ['admin', 'customer', 'agent'],
    description: 'User role',
  })
  role: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Created date',
  })
  createdAt: Date;

  updatedAt: Date;
}
