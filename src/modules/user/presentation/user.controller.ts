import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserService, USER_TOKENS } from '../application';
import { UserRole } from '../domain';
import { PaginationDto } from '../../../shared/presentation';
import { UserResponseDto } from './user-response.dto';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserMapper } from './user.mapper';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_TOKENS.USER_SERVICE)
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    type: [UserResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const paginationOptions = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder || 'ASC',
    };

    const result = await this.userService.findAll(paginationOptions);
    return {
      ...result,
      data: UserMapper.toResponseDtoList(result.data),
    };
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active users' })
  @ApiResponse({
    status: 200,
    description: 'Active users retrieved successfully',
    type: [UserResponseDto],
  })
  async findActiveUsers(@Query() pagination: PaginationDto) {
    const result = await this.userService.getActiveUsers({
      page: pagination.page || 1,
      limit: pagination.limit || 10,
    });
    return {
      ...result,
      data: UserMapper.toResponseDtoList(result.data),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    return UserMapper.toResponseDto(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userData = {
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phoneNumber: createUserDto.phoneNumber,
      dateOfBirth: createUserDto.dateOfBirth
        ? new Date(createUserDto.dateOfBirth)
        : undefined,
      role: createUserDto.role as UserRole,
    };

    const user = await this.userService.createUser(userData);
    return UserMapper.toResponseDto(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updateData = {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      phoneNumber: updateUserDto.phoneNumber,
      dateOfBirth: updateUserDto.dateOfBirth
        ? new Date(updateUserDto.dateOfBirth)
        : undefined,
    };

    const user = await this.userService.updateProfile(id, updateData);
    return UserMapper.toResponseDto(user);
  }

  @Put(':id/suspend')
  @ApiOperation({ summary: 'Suspend user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User suspended successfully',
    type: UserResponseDto,
  })
  async suspend(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.suspendUser(id);
    return UserMapper.toResponseDto(user);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Activate user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User activated successfully',
    type: UserResponseDto,
  })
  async activate(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.activateUser(id);
    return UserMapper.toResponseDto(user);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User deactivated successfully',
    type: UserResponseDto,
  })
  async deactivate(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.deactivateUser(id);
    return UserMapper.toResponseDto(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
