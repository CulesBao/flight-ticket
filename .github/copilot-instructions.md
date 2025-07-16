# Flight Booking API - AI Coding Agent Instructions

## 📚 Essential Documentation

This project follows comprehensive development standards documented in specialized instruction files. **Always consult these files first** before implementing any features:

### 🏛️ Architecture & Design

- **`.github/ddd-architecture.instruction.md`** - Complete DDD folder structure, 4-layer architecture, entities, services, dependency injection patterns
- **`.github/api-design.instruction.md`** - RESTful API design, DTOs, authentication, pagination, error handling, OpenAPI specs
- **`.github/database.instruction.md`** - TypeORM patterns, repository implementations, migrations, query optimization, testing

### 📋 Development Standards

- **`.github/commit-conventions.md`** - Commit message formats, branching strategy, PR guidelines

## 🎯 Key Architecture Principles

### 1. **Service Pattern** (Not Use Cases)

```typescript
@Injectable()
export class BookingService {
  async createBooking(command: CreateBookingCommand): Promise<BookingEntity> {...}
  async confirmBooking(bookingId: string): Promise<BookingEntity> {...}
  async cancelBooking(bookingId: string): Promise<BookingEntity> {...}
}
```

### 2. **Modular DI Tokens**

Each module manages its own dependency injection:

```typescript
// booking.tokens.ts
export const BOOKING_TOKENS = {
  BOOKING_REPOSITORY: 'BOOKING_REPOSITORY',
  BOOKING_SERVICE: 'BOOKING_SERVICE',
} as const;
```

## 🚀 Development Workflow

### Before Implementing Any Feature:

1. **📖 Read Relevant Instructions**: Check the appropriate `.github/*.instruction.md` file
2. **🏗️ Follow DDD Structure**: Use patterns from `ddd-architecture.instruction.md`
3. **🌐 API Design**: Follow guidelines in `api-design.instruction.md`
4. **🗄️ Database Work**: Follow patterns in `database.instruction.md`
5. **📝 Commit Standards**: Use format from `commit-conventions.md`

### Implementation Order:

1. **Domain Layer**: Entities, repositories (interfaces), enums
2. **Infrastructure**: Repository implementations (In-Memory first)
3. **Application**: Services with business logic
4. **Presentation**: Controllers, DTOs, validators

## 📋 Current Project State

### Implemented Domains

- **user-management** - Authentication & users
- **flight-management** - Flights & aircraft
- **booking-management** - Bookings & reservations
- **payment-management** - Payments & billing
- **notification-management** - Notifications & emails

### Technology Stack

- **NestJS** + **TypeScript** - Main framework
- **Redis Cluster** - Caching (ports 7000-7002)
- **Redlock** - Distributed locking
- **TypeORM** - Database ORM (configured for future use)
- **In-Memory Repositories** - Current data persistence

### File Naming Conventions

- **Entities**: `*.entity.ts`
- **Services**: `*.service.ts`
- **Repositories**: `*.repository.ts`
- **DTOs**: `*.dto.ts`
- **Tokens**: `*.tokens.ts`
- **Modules**: `*.module.ts`

## 🎯 AI Agent Guidelines

### Always Do:

- ✅ **Consult instruction files** before implementing features
- ✅ **Follow DDD patterns** from architecture guide
- ✅ **Use modular DI tokens** per domain
- ✅ **Implement Service pattern** (not Use Cases)
- ✅ **Write descriptive commit messages** per conventions
- ✅ **Start with In-Memory implementations** for repositories
- ✅ \*\*Response in Vietnamese

### Never Do:

- ❌ Use centralized DI tokens
- ❌ Mix business logic in controllers
- ❌ Skip reading relevant instruction files
- ❌ Use Use Case pattern (we use Services)
- ❌ Create files without following naming conventions

## 📖 Quick Reference Commands

When user asks for:

- **"Add new domain"** → Check `ddd-architecture.instruction.md` folder structure
- **"Create API endpoint"** → Check `api-design.instruction.md` for patterns
- **"Database work"** → Check `database.instruction.md` for TypeORM patterns
- **"Commit message"** → Check `commit-conventions.md` for format

## 🔍 Examples from Instruction Files

### Entity Pattern (from DDD guide):

```typescript
export class BookingEntity {
  constructor(
    public readonly id: string,
    private _status: BookingStatus,
  ) {}

  confirm(): void {
    if (this._status !== BookingStatus.PENDING) {
      throw new BookingAlreadyProcessedError();
    }
    this._status = BookingStatus.CONFIRMED;
  }
}
```

### API Controller Pattern (from API guide):

```typescript
@Controller('bookings')
export class BookingsController {
  @Post()
  async createBooking(
    @Body() dto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    // Implementation following API design patterns
  }
}
```

### Repository Pattern (from Database guide):

```typescript
@Injectable()
export class InMemoryBookingRepository implements BookingRepository {
  private bookings: BookingEntity[] = [];

  async findById(id: string): Promise<BookingEntity | null> {
    return this.bookings.find((booking) => booking.id === id) || null;
  }
}
```

---

**Remember**: These instruction files contain the complete patterns and examples. Always reference them for detailed implementation guidance!
