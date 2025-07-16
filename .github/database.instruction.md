# Database Interaction Guidelines

Guidelines for working with PostgreSQL database through TypeORM in our flight booking application.

## 🗄️ Schema Design (Entities)

- Each TypeORM entity must correspond to a PostgreSQL table
- Entity files must have `.entity.ts` suffix
- Use `@Entity()` decorator with **plural, snake_case** table names (e.g., `users`, `flight_bookings`)
- Column names should use **snake_case** convention
- Always define relationships (`@OneToMany`, `@ManyToOne`, `@ManyToMany`) clearly
- Use **lazy loading** or **eager loading** carefully to avoid N+1 query problems

### Entity Example

```typescript
@Entity('flight_bookings')
export class BookingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'flight_id' })
  flightId: string;

  @Column({ name: 'passenger_id' })
  passengerId: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => FlightEntity, { lazy: true })
  @JoinColumn({ name: 'flight_id' })
  flight: Promise<FlightEntity>;

  @ManyToOne(() => PassengerEntity, { lazy: true })
  @JoinColumn({ name: 'passenger_id' })
  passenger: Promise<PassengerEntity>;
}
```

## 🔗 Repository Pattern (TypeORM Implementation)

Our project uses **In-Memory repositories** following DDD patterns rather than direct TypeORM repositories. However, when implementing TypeORM repositories:

- Each entity should have a corresponding repository class
- Repository class must extend TypeORM Repository or implement custom interface
- Repository file must have `.repository.ts` suffix
- Repository contains **only database query logic**, no business logic
- Use Query Builder for complex queries with joins and conditions
- Implement proper error handling for database operations

### TypeORM Repository Example

```typescript
@Injectable()
export class TypeOrmBookingRepository extends Repository<BookingEntity> {
  constructor(
    @InjectRepository(BookingEntity)
    private bookingRepository: Repository<BookingEntity>,
  ) {
    super(
      bookingRepository.target,
      bookingRepository.manager,
      bookingRepository.queryRunner,
    );
  }

  async findBookingsByStatus(status: BookingStatus): Promise<BookingEntity[]> {
    return this.createQueryBuilder('booking')
      .where('booking.status = :status', { status })
      .leftJoinAndSelect('booking.flight', 'flight')
      .leftJoinAndSelect('booking.passenger', 'passenger')
      .orderBy('booking.created_at', 'DESC')
      .getMany();
  }

  async findBookingWithDetails(id: string): Promise<BookingEntity | null> {
    return this.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.flight', 'flight')
      .leftJoinAndSelect('booking.passenger', 'passenger')
      .leftJoinAndSelect('flight.airport_departure', 'departure')
      .leftJoinAndSelect('flight.airport_arrival', 'arrival')
      .where('booking.id = :id', { id })
      .getOne();
  }

  async findBookingsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<BookingEntity[]> {
    return this.createQueryBuilder('booking')
      .where('booking.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .leftJoinAndSelect('booking.flight', 'flight')
      .orderBy('booking.created_at', 'DESC')
      .getMany();
  }
}
```

### DDD Repository Interface (Current Approach)

```typescript
// Domain interface (src/domain/bookings/repositories/)
export interface BookingRepository {
  findById(id: string): BookingEntity | null;
  findByFlightId(flightId: string): BookingEntity[];
  findByStatus(status: BookingStatus): BookingEntity[];
  save(booking: BookingEntity): BookingEntity;
  delete(id: string): boolean;
}

// In-Memory implementation (src/infra/bookings/repositories/)
@Injectable()
export class InMemoryBookingRepository implements BookingRepository {
  private bookings: BookingEntity[] = [
    /* mock data */
  ];

  findById(id: string): BookingEntity | null {
    return this.bookings.find((booking) => booking.id === id) || null;
  }

  findByStatus(status: BookingStatus): BookingEntity[] {
    return this.bookings.filter((booking) => booking.status === status);
  }

  save(booking: BookingEntity): BookingEntity {
    const existingIndex = this.bookings.findIndex((b) => b.id === booking.id);
    if (existingIndex >= 0) {
      this.bookings[existingIndex] = booking;
    } else {
      this.bookings.push(booking);
    }
    return booking;
  }

  delete(id: string): boolean {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index >= 0) {
      this.bookings.splice(index, 1);
      return true;
    }
    return false;
  }
}
```

## 🚀 Performance Optimization

### Query Optimization

- When fetching data lists, only `SELECT` necessary columns using `QueryBuilder`
- Always use `pagination` for endpoints that return lists
- Add `indexes` on columns frequently used in `WHERE` clauses
- Use `EXPLAIN ANALYZE` to analyze query performance
- Implement **connection pooling** for database connections

### Example: Optimized Query with Pagination

```typescript
async findBookingsWithPagination(
  page: number,
  limit: number,
  filters?: BookingFilters,
): Promise<{ bookings: BookingEntity[]; total: number }> {
  const queryBuilder = this.createQueryBuilder('booking')
    .select([
      'booking.id',
      'booking.status',
      'booking.created_at',
      'flight.flight_number',
      'passenger.full_name',
    ])
    .leftJoin('booking.flight', 'flight')
    .leftJoin('booking.passenger', 'passenger');

  // Apply filters
  if (filters?.status) {
    queryBuilder.andWhere('booking.status = :status', { status: filters.status });
  }

  if (filters?.dateFrom && filters?.dateTo) {
    queryBuilder.andWhere('booking.created_at BETWEEN :dateFrom AND :dateTo', {
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    });
  }

  // Pagination
  const offset = (page - 1) * limit;
  queryBuilder.skip(offset).take(limit);

  // Get results and count
  const [bookings, total] = await queryBuilder.getManyAndCount();

  return { bookings, total };
}
```

### Database Indexing Strategy

```sql
-- Essential indexes for flight booking system
CREATE INDEX idx_bookings_status ON flight_bookings(status);
CREATE INDEX idx_bookings_created_at ON flight_bookings(created_at);
CREATE INDEX idx_bookings_flight_id ON flight_bookings(flight_id);
CREATE INDEX idx_bookings_passenger_id ON flight_bookings(passenger_id);

-- Composite indexes for common query patterns
CREATE INDEX idx_bookings_status_created_at ON flight_bookings(status, created_at);
CREATE INDEX idx_flights_departure_arrival ON flights(departure_airport_id, arrival_airport_id);
CREATE INDEX idx_flights_departure_time ON flights(departure_time);
```

## 💡 Transaction Management

### Using TypeORM Transactions

```typescript
@Injectable()
export class BookingService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async createBookingWithPayment(
    bookingData: CreateBookingDto,
    paymentData: CreatePaymentDto,
  ): Promise<BookingEntity> {
    return this.dataSource.transaction(async (manager) => {
      // Create booking
      const booking = manager.create(BookingEntity, bookingData);
      const savedBooking = await manager.save(booking);

      // Create payment
      const payment = manager.create(PaymentEntity, {
        ...paymentData,
        bookingId: savedBooking.id,
      });
      await manager.save(payment);

      // Update seat availability
      await manager.update(SeatEntity, bookingData.seatId, {
        isAvailable: false,
      });

      return savedBooking;
    });
  }
}
```

### Transaction Best Practices

- Keep transactions as **short** as possible
- Avoid **nested transactions** when possible
- Use **isolation levels** appropriately (`READ COMMITTED`, `REPEATABLE READ`)
- Always handle **rollback scenarios** properly
- Use **optimistic locking** for concurrent operations

## 📦 Database Migrations

### Migration File Structure

```
src/
  migrations/
    1699123456789-InitialSchema.ts
    1699123567890-AddBookingTables.ts
    1699123678901-AddIndexes.ts
    1699123789012-UpdateUserSchema.ts
```

### Migration Example

```typescript
import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateBookingTables1699123456789 implements MigrationInterface {
  name = 'CreateBookingTables1699123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'flight_bookings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'flight_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'passenger_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
            default: "'PENDING'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['flight_id'],
            referencedTableName: 'flights',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['passenger_id'],
            referencedTableName: 'passengers',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'flight_bookings',
      new Index('idx_bookings_status', ['status']),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('flight_bookings');
  }
}
```

### Migration Commands

```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

## 🔧 Environment Configuration

### Database Configuration (TypeORM)

```typescript
// config/database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'flight_booking',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  retryAttempts: 3,
  retryDelay: 3000,
  autoLoadEntities: true,
  keepConnectionAlive: true,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
```

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=secure_password
DB_DATABASE=flight_booking

# Connection Pool
DB_CONNECTION_POOL_MIN=2
DB_CONNECTION_POOL_MAX=10
DB_CONNECTION_TIMEOUT=30000
DB_IDLE_TIMEOUT=30000

# Migration
DB_SYNCHRONIZE=false
DB_LOGGING=true
DB_MIGRATIONS_RUN=true
```

## 🧪 Database Testing Patterns

### Test Database Setup

```typescript
// test/database-test.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, // Different port for testing
      username: 'test_user',
      password: 'test_password',
      database: 'flight_booking_test',
      entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
      synchronize: true, // OK for testing
      dropSchema: true, // Clean slate for each test
    }),
  ],
})
export class DatabaseTestModule {}
```

### Repository Testing Example

```typescript
describe('BookingRepository', () => {
  let repository: TypeOrmBookingRepository;
  let testingModule: TestingModule;

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [DatabaseTestModule, TypeOrmModule.forFeature([BookingEntity])],
      providers: [TypeOrmBookingRepository],
    }).compile();

    repository = testingModule.get<TypeOrmBookingRepository>(
      TypeOrmBookingRepository,
    );
  });

  afterEach(async () => {
    await testingModule.close();
  });

  it('should find bookings by status', async () => {
    // Arrange
    const booking = repository.create({
      flightId: 'flight-1',
      passengerId: 'passenger-1',
      status: BookingStatus.CONFIRMED,
    });
    await repository.save(booking);

    // Act
    const results = await repository.findBookingsByStatus(
      BookingStatus.CONFIRMED,
    );

    // Assert
    expect(results).toHaveLength(1);
    expect(results[0].status).toBe(BookingStatus.CONFIRMED);
  });
});
```

## 🔄 Connection Management & Health Checks

### Connection Pool Configuration

```typescript
@Injectable()
export class DatabaseHealthService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async checkDatabaseHealth(): Promise<boolean> {
    try {
      const result = await this.dataSource.query('SELECT 1');
      return result.length > 0;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  getConnectionInfo() {
    return {
      isConnected: this.dataSource.isInitialized,
      database: this.dataSource.options.database,
      host: this.dataSource.options.host,
      activeConnections:
        this.dataSource.manager.connection.driver.pool?.totalCount || 0,
      idleConnections:
        this.dataSource.manager.connection.driver.pool?.idleCount || 0,
    };
  }
}
```

## ⚠️ Error Handling & Monitoring

### Database Error Handling

```typescript
@Injectable()
export class DatabaseErrorHandler {
  handleTypeOrmError(error: any): never {
    if (error.code === '23505') {
      // Unique constraint violation
      throw new ConflictException('Resource already exists');
    }

    if (error.code === '23503') {
      // Foreign key constraint violation
      throw new BadRequestException('Referenced resource does not exist');
    }

    if (error.code === 'ECONNREFUSED') {
      // Connection refused
      throw new ServiceUnavailableException('Database connection failed');
    }

    if (error.name === 'QueryFailedError') {
      throw new BadRequestException('Invalid query parameters');
    }

    // Generic database error
    throw new InternalServerErrorException('Database operation failed');
  }
}
```

### Query Performance Monitoring

```typescript
@Injectable()
export class QueryPerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const request = context.switchToHttp().getRequest();

        if (duration > 1000) {
          // Log slow queries
          console.warn(
            `Slow query detected: ${request.method} ${request.url} - ${duration}ms`,
          );
        }
      }),
    );
  }
}
```

## 📊 Best Practices Summary

### DO's ✅

- Use **migrations** for all schema changes
- Implement **proper indexing** strategy
- Use **transactions** for related operations
- Apply **connection pooling** configuration
- Handle **database errors** gracefully
- Use **pagination** for large datasets
- Implement **query optimization** techniques
- Follow **naming conventions** (snake_case for DB, camelCase for TypeScript)

### DON'Ts ❌

- Don't use `synchronize: true` in production
- Don't forget to add **foreign key constraints**
- Don't ignore **N+1 query problems**
- Don't skip **database connection health checks**
- Don't use `SELECT *` in production queries
- Don't forget to **close connections** in tests
- Don't expose **raw database errors** to clients
- Don't skip **backup and recovery** planning

## 🔗 Integration with DDD Architecture

Our current **In-Memory repositories** follow DDD principles:

1. **Domain Layer**: Defines repository interfaces and business rules
2. **Infrastructure Layer**: Implements repositories (currently In-Memory, future TypeORM)
3. **Application Layer**: Uses repositories through dependency injection
4. **API Layer**: Controllers orchestrate services without database knowledge

When migrating to TypeORM, maintain these DDD boundaries and continue using the established **modular DI token system**.
