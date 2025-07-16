# Domain-Driven Design (DDD) Architecture Guide

This document outlines the Domain-Driven Design architecture implementation in our NestJS TypeScript flight booking API.

## 📁 DDD Folder Structure

```
src/
├── shared/                           # 🤝 Common components
│   ├── domain/                       # Base entities, errors, types
│   ├── application/                  # Guards, interceptors, decorators
│   ├── infrastructure/               # Config, utils, constants
│   └── presentation/                 # Exception filters, middleware
│
├── modules/                          # 📦 Business domains
│   ├── user-management/              # Authentication & users
│   ├── flight-management/            # Flights & aircraft
│   ├── booking-management/           # Bookings & reservations
│   ├── payment-management/           # Payments & billing
│   └── notification-management/      # Notifications & emails
│
├── infrastructure/                   # 🔧 Cross-cutting services
│   ├── database/                     # Migrations, seeds
│   ├── cache/                        # Redis, Redlock
│   ├── events/                       # Event bus
│   ├── monitoring/                   # Health, metrics, logging
│   └── security/                     # Encryption, validation
│
├── main.ts
├── app.module.ts
└── app.controller.ts
```

### Module Structure (Each domain follows same pattern)

```
modules/{domain}/
├── domain/                           # Business logic
│   ├── entities/                     # Business objects
│   ├── repositories/                 # Data contracts
│   ├── services/                     # Domain services
│   └── enums/                        # Domain constants
│
├── application/                      # Use cases
│   ├── services/                     # Application services
│   ├── dto/                          # Data transfer objects
│   └── mappers/                      # Entity/DTO conversion
│
├── infrastructure/                   # External concerns
│   ├── repositories/                 # Database implementations
│   └── external-services/            # Third-party integrations
│
├── presentation/                     # HTTP interface
│   ├── controllers/                  # API endpoints
│   └── dto/                          # Request/response DTOs
│
├── {domain}.module.ts                # NestJS module
└── {domain}.tokens.ts                # DI tokens
```

## 🏗️ Layer Responsibilities

### 1. Domain Layer

- **Purpose**: Core business logic and rules
- **Contents**: Entities, repositories, domain services, enums
- **Rules**: No external dependencies, pure business logic

### 2. Application Layer

- **Purpose**: Application services and orchestration
- **Contents**: Services, DTOs, mappers, module configuration
- **Rules**: Orchestrates domain objects, application-specific rules

### 3. Infrastructure Layer

- **Purpose**: External concerns and implementations
- **Contents**: Repository implementations, external services, config
- **Rules**: Implements domain interfaces, handles external dependencies

### 4. Presentation Layer

- **Purpose**: HTTP interface and API contracts
- **Contents**: Controllers, request/response DTOs, guards
- **Rules**: Handle HTTP only, validate input, transform data

## 🎯 Key DDD Patterns

### Entity Example

```typescript
export class BookingEntity {
  constructor(
    public readonly id: string,
    public readonly flightId: string,
    private _status: BookingStatus,
  ) {}

  confirm(): void {
    if (this._status !== BookingStatus.PENDING) {
      throw new BookingAlreadyProcessedError();
    }
    this._status = BookingStatus.CONFIRMED;
  }

  get status(): BookingStatus {
    return this._status;
  }
}
```

### Repository Interface

```typescript
export interface BookingRepository {
  findById(id: string): BookingEntity | null;
  save(booking: BookingEntity): void;
  delete(id: string): void;
}
```

### Application Service

```typescript
@Injectable()
export class BookingService {
  constructor(
    @Inject(BOOKING_TOKENS.BOOKING_REPOSITORY)
    private readonly bookingRepository: BookingRepository,
  ) {}

  async createBooking(command: CreateBookingCommand): Promise<BookingEntity> {
    const booking = new BookingEntity(
      generateId(),
      command.flightId,
      BookingStatus.PENDING,
    );

    return this.bookingRepository.save(booking);
  }
}
```

## 🔧 Dependency Injection

### Tokens per Module

```typescript
// booking.tokens.ts
export const BOOKING_TOKENS = {
  BOOKING_REPOSITORY: 'BOOKING_REPOSITORY',
  BOOKING_SERVICE: 'BOOKING_SERVICE',
} as const;
```

### Module Configuration

```typescript
@Module({
  providers: [
    {
      provide: BOOKING_TOKENS.BOOKING_REPOSITORY,
      useClass: InMemoryBookingRepository,
    },
    {
      provide: BOOKING_TOKENS.BOOKING_SERVICE,
      useClass: BookingService,
    },
  ],
  exports: [BOOKING_TOKENS.BOOKING_SERVICE],
})
export class BookingsModule {}
```

## 📋 Best Practices

### Entity Design

- ✅ Immutable by default (private setters, public getters)
- ✅ Business methods that modify state
- ✅ Validation in constructor

### Repository Pattern

- ✅ Simple, focused methods
- ✅ Return domain entities, not database records
- ✅ Named after business concepts

### Application Services

- ✅ Single responsibility per service
- ✅ Coordinate domain objects and repositories
- ✅ Handle business workflows

## 📖 File Naming Conventions

- **Entities**: `*.entity.ts`
- **Repositories**: `*.repository.ts`
- **Services**: `*.service.ts`
- **DTOs**: `*.dto.ts`
- **Tokens**: `*.tokens.ts`
- **Modules**: `*.module.ts`
