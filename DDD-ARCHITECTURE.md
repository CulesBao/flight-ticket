# Domain-Driven Design (DDD) Architecture

Dự án này được tổ chức theo kiến trúc Domain-Driven Design với 4 layers chính:

## 📁 Cấu trúc thư mục

```
src/
├── api/           # API Layer (Controllers, DTOs, Mappers)
├── app/           # Application Layer (Use Cases)
├── domain/        # Domain Layer (Entities, Value Objects, Repositories)
└── infra/         # Infrastructure Layer (Repository Implementations)


## 🏗️ Layers mô tả

### 1. Domain Layer (`src/domain/`)

- **Entities**: Business logic core
- **Repositories**: Interfaces cho data access
- **Errors**: Domain-specific errors
- **Value Objects**: Immutable objects representing domain concepts

### 2. Application Layer (`src/app/`)

- **Use Cases**: Application business logic
- **Commands/Queries**: CQRS pattern implementation
- Orchestrates domain objects và repositories

### 3. Infrastructure Layer (`src/infra/`)

- **Repository Implementations**: Concrete implementations của domain repositories
- **External Services**: Third-party integrations
- **Database**: Data persistence logic

### 4. API Layer (`src/api/`)

- **Controllers**: HTTP endpoints
- **DTOs**: Data Transfer Objects
- **Mappers**: Convert giữa domain entities và DTOs

## 🔄 Data Flow

```

HTTP Request → Controller → Use Case → Domain → Repository → Database
↓ ↓ ↓ ↓
Mapper ← DTO ← Entity ← Interface ← Implementation

````

## ✅ Benefits của DDD Architecture

1. **Separation of Concerns**: Mỗi layer có responsibility riêng
2. **Testability**: Dễ dàng unit test từng layer
3. **Maintainability**: Code dễ maintain và extend
4. **Domain Focus**: Business logic được tập trung trong domain layer

## 🚀 Sử dụng

### API Endpoints

- `GET /api/v1/airports` - Lấy tất cả airports
- `GET /api/v1/airports/:code` - Lấy airport theo code

### Ví dụ Response

```json
{
  "airportCode": "ATL",
  "airportOfficialName": "Hartsfield–Jackson Atlanta International Airport",
  "commonName": "Atlanta",
  "cityName": "Atlanta",
  "countryName": "United States"
}
````
