# API Đặt Vé Máy Bay - Hướng Dẫn Cho AI Coding Agent

## Tổng Quan Kiến Trúc

Đây là ứng dụng NestJS TypeScript theo mô hình **Domain-Driven Design (DDD)** với phân tách rõ ràng các tầng:

- `src/domain/` - Entities nghiệp vụ cốt lõi, interfaces repository, enums, errors
- `src/app/` - Use cases, mappers, DTOs, modules (tầng điều phối ứng dụng)
- `src/infra/` - Triển khai repository (hiện tại là In-Memory), cấu hình Redis/Redlock
- `src/api/` - Controllers expose HTTP endpoints

**Quy Tắc Quan Trọng**: Mỗi module quản lý DI tokens riêng của mình. Sử dụng tokens từ file `{module}.tokens.ts` trong cùng module thay vì centralized tokens. Ví dụ: `AIRPORT_TOKENS.AIRPORT_REPOSITORY` trong airports module.

## GitHub Conventions

**Quy Tắc Bắt Buộc**: Tất cả nội dung liên quan đến GitHub phải được viết bằng **tiếng Anh** để đảm bảo tính nhất quán và chuyên nghiệp:

### Git Commit Messages

- ✅ **ĐÚNG**: `feat: add Redis cluster configuration for distributed caching`
- ✅ **ĐÚNG**: `refactor: migrate from centralized to modular DI tokens`
- ✅ **ĐÚNG**: `fix: resolve TypeScript errors in airport use cases`
- ❌ **SAI**: `feat: thêm cấu hình Redis cluster cho distributed caching`

### Pull Request & Issues

- **Title**: Luôn bằng tiếng Anh
- **Description**: Bằng tiếng Anh với format markdown rõ ràng
- **Labels**: Sử dụng labels tiếng Anh (enhancement, bug, refactor, etc.)
- **Comments**: Tiếng Anh trong tất cả discussions

### Branch Names

- ✅ **ĐÚNG**: `feature/user-authentication`, `bugfix/redis-connection`, `refactor/modular-tokens`
- ❌ **SAI**: `feature/xac-thuc-nguoi-dung`, `bugfix/loi-ket-noi-redis`

### Documentation in Code

- **README.md**: Tiếng Anh
- **API Documentation**: Tiếng Anh
- **Code Comments**: Ưu tiên tiếng Anh cho public APIs
- **Internal Documentation**: Có thể tiếng Việt trong file instructions này

### Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types**: feat, fix, docs, style, refactor, test, chore
**Examples**:

- `feat(auth): implement JWT token validation`
- `fix(redis): resolve connection timeout issues`
- `refactor(tokens): migrate to modular DI approach`

## Quy Trình Phát Triển Chính

### Thêm Domain Mới

1. Tạo entity trong `src/domain/{domain}/entities/` với validation trong constructor
2. Định nghĩa repository interface trong `src/domain/{domain}/repositories/`
3. Thêm barrel export trong `src/domain/{domain}/index.ts`
4. Triển khai In-Memory repository trong `src/infra/{domain}/repositories/` với mock data
5. Tạo DI tokens file trong `src/app/{domain}/{domain}.tokens.ts`
6. Tạo use cases trong `src/app/{domain}/use-cases/` sử dụng tokens từ `{domain}.tokens.ts`
7. Cài đặt DI module trong `src/app/{domain}/{domain}.module.ts` với tokens riêng
8. Tạo controller trong `src/api/{domain}/controllers/` với ánh xạ DTOs và entities
9. Cập nhật API specification trong `docs/api-specification.md` nếu cần

### Lệnh Testing & Development

```bash
npm run start:dev    # Chế độ watch với hot reload
npm run test         # Unit tests với Jest
npm run test:e2e     # End-to-end tests
npm run gen          # Custom module generator (scripts/generate-module.js)
```

### Mẫu Code

- **Entities**: Classes bất biến với validation, business methods (ví dụ: `seat.reserve()`, `booking.confirm()`)
- **Repositories**: Interfaces đồng bộ trả về entities hoặc null
- **Use Cases**: Methods bất đồng bộ inject repositories qua DI tokens
- **Controllers**: Ánh xạ giữa DTOs và domain entities sử dụng mapper classes chuyên dụng

## Quy Ước Đặc Thù Dự Án

### Thiết Kế Entity

Tất cả entities tuân theo mẫu này:

```typescript
export class SeatEntity implements Seat {
  constructor(public readonly id: string /* các props khác */) {
    this.validateSeatNumber(seatNumber); // Validation trong constructor
  }

  isAvailable(): boolean {
    /* business logic */
  }
  reserve(): SeatEntity {
    /* trả về instance mới */
  }
}
```

### Triển Khai Repository

In-Memory repositories sử dụng arrays với đầy đủ CRUD:

```typescript
private seats: SeatEntity[] = [/* mock data */];
findById(id: string): SeatEntity | null { /* implementation */ }
```

### Cấu Hình Module

Mỗi module sử dụng DI tokens từ file tokens riêng:

```typescript
import { AIRPORT_TOKENS } from './airports.tokens';

providers: [
  {
    provide: AIRPORT_TOKENS.AIRPORT_REPOSITORY,
    useClass: InMemoryAirportRepository,
  },
];
```

### Quản Lý DI Tokens

Mỗi module quản lý tokens riêng của mình trong file `{module}.tokens.ts`:

**Domain Tokens** (trong `src/app/{domain}/{domain}.tokens.ts`):

```typescript
export const AIRPORT_TOKENS = {
  // Repository
  AIRPORT_REPOSITORY: 'AIRPORT_REPOSITORY',

  // Use Cases
  GET_AIRPORT_BY_CODE_USE_CASE: 'GET_AIRPORT_BY_CODE_USE_CASE',
  GET_ALL_AIRPORTS_USE_CASE: 'GET_ALL_AIRPORTS_USE_CASE',
} as const;

export type AirportToken = keyof typeof AIRPORT_TOKENS;
```

**Infrastructure Tokens** (trong `src/infra/{service}/{service}.tokens.ts`):

```typescript
// Redis tokens trong src/infra/redis/redis.tokens.ts
export const REDIS_TOKENS = {
  REDIS_CLIENT: 'REDIS_CLIENT',
  REDIS_SERVICE: 'REDIS_SERVICE',
  REDIS_CLUSTER: 'REDIS_CLUSTER',
} as const;

// Redlock tokens trong src/infra/redlock/redlock.tokens.ts
export const REDLOCK_TOKENS = {
  REDLOCK_INSTANCE: 'REDLOCK_INSTANCE',
  REDLOCK_SERVICE: 'REDLOCK_SERVICE',
} as const;
```

### Best Practices cho Modular Tokens

1. **Naming Convention**:

   - Domain tokens: `{DOMAIN}_TOKENS` (ví dụ: `AIRPORT_TOKENS`, `SEAT_TOKENS`)
   - Infrastructure tokens: `{SERVICE}_TOKENS` (ví dụ: `REDIS_TOKENS`, `REDLOCK_TOKENS`)

2. **File Structure**:

   - Domain tokens: `src/app/{domain}/{domain}.tokens.ts`
   - Infrastructure tokens: `src/infra/{service}/{service}.tokens.ts`

3. **Import Pattern**:

   ```typescript
   // Trong use case
   import { AIRPORT_TOKENS } from '../airports.tokens';

   // Trong module
   import { AIRPORT_TOKENS } from './airports.tokens';

   // Infrastructure
   import { REDIS_TOKENS } from './redis.tokens';
   ```

4. **Type Safety**:
   ```typescript
   export type AirportToken = keyof typeof AIRPORT_TOKENS;
   export type RedisToken = keyof typeof REDIS_TOKENS;
   ```

### Migration từ Centralized sang Modular Tokens

Dự án đã được refactor từ centralized tokens sang modular tokens (PR #2). Khi làm việc với dự án:

1. **Không sử dụng**: `src/shared/constants/injection-tokens.ts` (đã bị xóa)
2. **Sử dụng**: Module-specific token files
3. **Pattern cũ** (deprecated):
   ```typescript
   import { REPOSITORY_TOKENS } from 'src/shared/constants/injection-tokens';
   provide: REPOSITORY_TOKENS.AIRPORT_REPOSITORY;
   ```
4. **Pattern mới** (recommended):
   ```typescript
   import { AIRPORT_TOKENS } from './airports.tokens';
   provide: AIRPORT_TOKENS.AIRPORT_REPOSITORY;
   ```

## Dependencies Bên Ngoài

- **Redis Cluster**: 3 instances trên ports 7000-7002 (docker-compose.yml)
- **Redlock**: Dịch vụ distributed locking cấu hình trong `src/infra/redlock/`
- **API Specification**: Có sẵn qua MCP với 2 airport endpoints

## Mô Hình Domain

Các domains hiện tại: `airports`, `seats`, `bookings`, `passengers`, `payments`, `flights`, `airline`, `plane`

Mỗi domain có đầy đủ entity validation, repository interfaces, và triển khai In-Memory với mock data thực tế.

## Files Tham Khảo Quan Trọng

- `DDD-ARCHITECTURE.md` - Giải thích chi tiết kiến trúc
- `src/app/airports/airports.module.ts` - Ví dụ hoàn chỉnh về cài đặt DI với modular tokens
- `src/app/airports/airports.tokens.ts` - Mẫu token file cho domain module
- `src/infra/redis/redis.tokens.ts` - Mẫu token file cho infrastructure service
- `src/domain/bookings/entities/booking.entity.ts` - Entity phức tạp với business rules
- `src/infra/seats/repositories/in-memory-seat.repository.ts` - Mẫu triển khai repository
