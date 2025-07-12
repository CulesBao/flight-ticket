# API Đặt Vé Máy Bay - Hướng Dẫn Cho AI Coding Agent

## Tổng Quan Kiến Trúc

Đây là ứng dụng NestJS TypeScript theo mô hình **Domain-Driven Design (DDD)** với phân tách rõ ràng các tầng:

- `src/domain/` - Entities nghiệp vụ cốt lõi, interfaces repository, enums, errors
- `src/app/` - Use cases, mappers, DTOs, modules (tầng điều phối ứng dụng)
- `src/infra/` - Triển khai repository (hiện tại là In-Memory), cấu hình Redis/Redlock
- `src/api/` - Controllers expose HTTP endpoints

**Quy Tắc Quan Trọng**: Luôn sử dụng dependency injection tokens từ `src/shared/constants/injection-tokens.ts` khi inject repositories vào use cases. Sử dụng `REPOSITORY_TOKENS.{DOMAIN}_REPOSITORY` thay vì hardcode string.

## Quy Trình Phát Triển Chính

### Thêm Domain Mới

1. Tạo entity trong `src/domain/{domain}/entities/` với validation trong constructor
2. Định nghĩa repository interface trong `src/domain/{domain}/repositories/`
3. Thêm barrel export trong `src/domain/{domain}/index.ts`
4. Triển khai In-Memory repository trong `src/infra/{domain}/repositories/` với mock data
5. Tạo use cases trong `src/app/{domain}/use-cases/`
6. Cài đặt DI module trong `src/app/{domain}/{domain}.module.ts` với repository token
7. Tạo repository token file trong `src/app/{domain}/{domain}.tokens.ts`
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

Mỗi module sử dụng DI tokens từ constants file:

```typescript
import { REPOSITORY_TOKENS } from 'src/shared/constants/injection-tokens';

providers: [
  {
    provide: REPOSITORY_TOKENS.AIRPORT_REPOSITORY,
    useClass: InMemoryAirportRepository,
  },
];
```

### Quản Lý DI Tokens

Tất cả DI tokens được quản lý tập trung trong `src/shared/constants/injection-tokens.ts`:

```typescript
export const REPOSITORY_TOKENS = {
  AIRPORT_REPOSITORY: 'AIRPORT_REPOSITORY',
  SEAT_REPOSITORY: 'SEAT_REPOSITORY',
  // ... other repository tokens
} as const;

export const REDIS_TOKENS = {
  REDIS_CLIENT: 'REDIS_CLIENT',
  REDIS_SERVICE: 'REDIS_SERVICE',
} as const;
```

{ provide: AIRPORT_REPOSITORY_TOKEN, useClass: InMemoryAirportRepository },
];

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
- `src/app/airports/airports.module.ts` - Ví dụ hoàn chỉnh về cài đặt DI
- `src/domain/bookings/entities/booking.entity.ts` - Entity phức tạp với business rules
- `src/infra/seats/repositories/in-memory-seat.repository.ts` - Mẫu triển khai repository
```
