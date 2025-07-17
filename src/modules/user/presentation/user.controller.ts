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
import { UserService, USER_TOKENS } from '../application';
import { UserRole } from '../domain';
import { PaginationDto } from '../../../shared/presentation';
import { UserResponseDto } from './user-response.dto';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserMapper } from './user.mapper';

@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_TOKENS.USER_SERVICE)
    private readonly userService: UserService,
  ) {}

  @Get()
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
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.findById(id);
    return UserMapper.toResponseDto(user);
  }

  @Post()
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
  async suspend(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.suspendUser(id);
    return UserMapper.toResponseDto(user);
  }

  @Put(':id/activate')
  async activate(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.activateUser(id);
    return UserMapper.toResponseDto(user);
  }

  @Put(':id/deactivate')
  async deactivate(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.userService.deactivateUser(id);
    return UserMapper.toResponseDto(user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
