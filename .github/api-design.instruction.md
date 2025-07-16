# API Design Guidelines

Guidelines for creating and modifying API-related code (controllers, DTOs) in our NestJS flight booking application.

## 🌐 RESTful Routing

- Use **plural nouns** for resources (e.g., `/users`, `/bookings`, `/flights`).
- Follow standard HTTP methods:
  - `GET /resources`: Retrieve list of resources
  - `GET /resources/{id}`: Retrieve specific resource
  - `POST /resources`: Create new resource
  - `PATCH /resources/{id}`: Partial update of resource
  - `DELETE /resources/{id}`: Delete resource
- Use API versioning in URL: `/api/v1/users`
- Use nested resources for relationships: `/api/v1/flights/{id}/seats`

### Route Examples

```typescript
@Controller('api/v1/bookings')
export class BookingsController {
  @Get()
  async getBookings(@Query() query: GetBookingsDto) {}

  @Get(':id')
  async getBooking(@Param('id') id: string) {}

  @Post()
  async createBooking(@Body() dto: CreateBookingDto) {}

  @Patch(':id')
  async updateBooking(@Param('id') id: string, @Body() dto: UpdateBookingDto) {}
}
```

## 📝 Data Transfer Objects (DTOs)

- **All input data** from client must be validated using DTOs
- Use `class-validator` and `class-transformer` decorators
- DTO files must have `.dto.ts` suffix (e.g., `create-booking.dto.ts`)
- Separate DTOs for different operations:
  - **Create**: `CreateBookingDto`
  - **Update**: `UpdateBookingDto`
  - **Query**: `GetBookingsDto`
  - **Response**: `BookingResponseDto`

### DTO Examples

```typescript
// create-booking.dto.ts
export class CreateBookingDto {
  @IsUuid()
  @IsNotEmpty()
  flightId: string;

  @IsUuid()
  @IsNotEmpty()
  passengerId: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;
}

// get-bookings.dto.ts
export class GetBookingsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
```

## 📤 Response Format

- **Success responses** (status `2xx`) should have consistent structure:

```typescript
// Standard success response
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "flightId": "987fcdeb-51a2-43d7-8c7e-123456789abc",
    "status": "confirmed",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

// List response with pagination
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

- **Error responses** (status `4xx`, `5xx`) should follow this structure:

```typescript
// Validation error (400)
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    },
    {
      "field": "flightId",
      "message": "Flight ID is required"
    }
  ]
}

// Business logic error (409)
{
  "success": false,
  "message": "Flight is fully booked",
  "errorCode": "FLIGHT_FULLY_BOOKED"
}

// Not found error (404)
{
  "success": false,
  "message": "Booking not found",
  "errorCode": "BOOKING_NOT_FOUND"
}
```

### Response DTOs

```typescript
export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data?: T;

  @ApiPropertyOptional()
  pagination?: PaginationMetaDto;
}

export class ErrorResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  errorCode?: string;

  @ApiPropertyOptional()
  errors?: ValidationErrorDto[];
}
```

## 🔐 Authentication & Authorization

- Use **JWT (JSON Web Tokens)** for authentication
- Apply NestJS Guards to protect routes with clear naming (e.g., `JwtAuthGuard`, `RolesGuard`)
- Use decorators for role-based access control

### Guard Examples

```typescript
@Controller('api/v1/admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
export class AdminBookingsController {
  @Get()
  async getAllBookings() {}
}

@Controller('api/v1/bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  @Get('my-bookings')
  async getMyBookings(@CurrentUser() user: User) {}
}
```

## 📊 Pagination & Filtering

- **Always use pagination** for list endpoints
- Provide filtering options for common use cases
- Use consistent query parameter naming

### Pagination DTO

```typescript
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class PaginationMetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  hasPrev: boolean;
}
```

## 🚫 Error Handling

- Use NestJS built-in `HttpException` classes
- Create custom exception filters for domain-specific errors
- Map domain errors to appropriate HTTP status codes

### Custom Exception Filter

```typescript
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse = {
      success: false,
      message: exception.message,
      errorCode: exception.code,
    };

    response.status(exception.httpStatus).json(errorResponse);
  }
}
```

## 📚 OpenAPI Documentation

- Use Swagger decorators for API documentation
- Document all endpoints, DTOs, and response types
- Provide examples for complex request/response bodies

### Swagger Examples

```typescript
@Controller('api/v1/bookings')
@ApiTags('Bookings')
export class BookingsController {
  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    type: ErrorResponseDto,
  })
  async createBooking(@Body() dto: CreateBookingDto) {}
}
```

## 🎯 Best Practices

### Controller Design

- ✅ Keep controllers thin (delegate to services)
- ✅ Use dependency injection for services
- ✅ Handle only HTTP concerns
- ❌ No business logic in controllers

### DTO Validation

- ✅ Validate all input data
- ✅ Use appropriate validation decorators
- ✅ Provide clear error messages
- ✅ Transform data types when needed

### Error Responses

- ✅ Consistent error format across all endpoints
- ✅ Meaningful error messages
- ✅ Appropriate HTTP status codes
- ✅ Error codes for client-side handling

### Performance

- ✅ Implement pagination for all list endpoints
- ✅ Use filtering to reduce data transfer
- ✅ Cache frequently accessed data
- ✅ Optimize database queries

### Controller Service Integration Example

```typescript
@Controller('api/v1/bookings')
@ApiTags('Bookings')
export class BookingsController {
  constructor(
    @Inject(BOOKING_TOKENS.BOOKING_SERVICE)
    private readonly bookingService: BookingService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  async createBooking(
    @Body() dto: CreateBookingDto,
  ): Promise<ApiResponseDto<BookingResponseDto>> {
    try {
      const booking = await this.bookingService.createBooking({
        flightId: dto.flightId,
        passengerId: dto.passengerId,
        specialRequests: dto.specialRequests,
      });

      return {
        success: true,
        message: 'Booking created successfully',
        data: BookingMapper.toResponseDto(booking),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm a booking' })
  async confirmBooking(
    @Param('id') id: string,
  ): Promise<ApiResponseDto<BookingResponseDto>> {
    const booking = await this.bookingService.confirmBooking(id);

    return {
      success: true,
      message: 'Booking confirmed successfully',
      data: BookingMapper.toResponseDto(booking),
    };
  }

  @Get('passenger/:passengerId')
  @ApiOperation({ summary: 'Get bookings by passenger' })
  async getBookingsByPassenger(
    @Param('passengerId') passengerId: string,
    @Query() query: PaginationDto,
  ): Promise<ApiResponseDto<BookingResponseDto[]>> {
    const bookings =
      await this.bookingService.getBookingsByPassenger(passengerId);

    return {
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings.map(BookingMapper.toResponseDto),
    };
  }
}
```
