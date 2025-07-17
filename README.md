# ✈️ Flight Ticket Booking API

A comprehensive flight booking system built with **NestJS** following **Domain-Driven Design (DDD)** architecture principles.

## 🏗️ Architecture Overview

This project implements a complete **4-layer DDD architecture**:

- **Domain Layer**: Entities, Value Objects, Domain Services, Repository Interfaces
- **Application Layer**: Use Cases, Application Services, DTOs
- **Infrastructure Layer**: Repository Implementations, External Services, Database
- **Presentation Layer**: Controllers, Request/Response DTOs, API Documentation

## 🚀 Features

### ✅ **Core Business Modules**

#### 🏢 **Airport Management**

- Airport CRUD operations with IATA/ICAO codes
- Airport search and filtering
- Comprehensive airport data with city, country, timezone

#### ✈️ **Flight Management**

- Flight scheduling and management
- Seat availability and reservation system
- Aircraft type and capacity management
- Real-time flight status updates
- Advanced flight search with filters

#### 👥 **User Management**

- User registration and profile management
- Role-based access control (Admin, Agent, Customer)
- User status management (Active, Inactive, Suspended)
- Email and phone number validation

#### 🎫 **Booking Management**

- Multi-passenger booking support
- Booking confirmation workflow
- Booking reference generation
- Passenger details with seat assignment
- Booking status tracking (Pending → Confirmed → Completed)

#### 💳 **Payment Processing**

- Multiple payment methods (Credit Card, Debit Card, Bank Transfer, E-Wallet)
- Payment lifecycle management (Pending → Processing → Completed)
- Transaction tracking and refund support
- Multi-gateway integration (Stripe, PayPal ready)

#### 💺 **Seat Management**

- Detailed seat mapping with position tracking (row/column)
- Multiple seat classes (Economy, Premium Economy, Business, First)
- Seat types (Window, Middle, Aisle) and premium features
- Real-time seat availability and reservation system
- Seat blocking/unblocking for maintenance
- Dynamic pricing based on class and features

### 🔧 **Infrastructure & Technical Features**

#### 📡 **Redis Cluster & Caching**

- Redis cluster configuration (ports 7000-7002)
- Distributed caching for high performance
- Cache invalidation strategies

#### 🔒 **Redlock Distributed Locking**

- Race condition prevention in distributed environment
- Automatic lock extension and cleanup
- Retry mechanisms for lock acquisition

#### 📚 **API Documentation**

- Complete OpenAPI/Swagger documentation
- Request/Response examples
- Error handling documentation

## 🛠️ Technology Stack

- **Framework**: NestJS with TypeScript
- **Architecture**: Domain-Driven Design (DDD) 4-layer
- **Caching**: Redis Cluster
- **Locking**: Redlock for distributed systems
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Database**: In-Memory repositories (ready for TypeORM integration)

## 📦 Project Structure

```
src/
├── infrastructure/          # Infrastructure layer
│   └── cache/
│       ├── redis/          # Redis cluster service
│       └── redlock/        # Distributed locking
├── modules/                # Business domains
│   ├── airport/           # Airport management
│   ├── flight/            # Flight operations
│   ├── user/              # User management
│   ├── booking/           # Booking system
│   ├── payment/           # Payment processing
│   └── seat/              # Seat management
└── shared/                # Shared kernel
    ├── domain/            # Base entities, value objects
    ├── application/       # Common interfaces
    ├── infrastructure/    # Base repositories
    └── presentation/      # Common DTOs
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Redis server (for caching and distributed locking)

### Installation

```bash
# Clone the repository
git clone https://github.com/CulesBao/flight-ticket.git
cd flight-ticket

# Install dependencies
npm install

# Start Redis cluster (required for caching)
# Make sure Redis is running on ports 7000, 7001, 7002
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod

# Build the project
npm run build
```

### Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🌐 API Endpoints

### 🏢 Airports

- `GET /airports` - Get all airports
- `GET /airports/:code` - Get airport by IATA/ICAO code
- `POST /airports` - Create new airport (Admin only)

### ✈️ Flights

- `GET /flights` - Get all flights with pagination
- `GET /flights/search` - Search flights by criteria
- `GET /flights/:id` - Get flight details

### 👥 Users

- `GET /users` - Get all users
- `GET /users/active` - Get active users
- `POST /users` - Create new user
- `PUT /users/:id` - Update user profile
- `PUT /users/:id/suspend` - Suspend user (Admin only)

### 🎫 Bookings

- `GET /bookings` - Get all bookings
- `POST /bookings` - Create new booking
- `PUT /bookings/:id/confirm` - Confirm booking
- `PUT /bookings/:id/cancel` - Cancel booking

### 💳 Payments

- `GET /payments` - Get all payments
- `POST /payments` - Create payment
- `PUT /payments/:id/process` - Process payment
- `PUT /payments/:id/complete` - Complete payment

### 💺 Seats

- `GET /seats/flight/:flightId` - Get all seats for a flight
- `GET /seats/flight/:flightId/available` - Get available seats
- `GET /seats/flight/:flightId/map` - Get seat map with layout
- `GET /seats/flight/:flightId/statistics` - Get seat statistics
- `PUT /seats/:id/reserve` - Reserve a specific seat
- `PUT /seats/flight/:flightId/seat/:seatNumber/reserve` - Reserve by seat number
- `POST /seats/generate` - Generate seats for a flight

## 📊 Business Workflow

```mermaid
graph TD
    A[User Registration] --> B[Search Flights]
    B --> C[Select Flight]
    C --> D[Create Booking]
    D --> E[Add Passengers]
    E --> F[Select Seats]
    F --> G[Create Payment]
    G --> H[Process Payment]
    H --> I{Payment Success?}
    I -->|Yes| J[Confirm Booking]
    I -->|No| K[Cancel Booking]
    J --> L[Send Confirmation]
    K --> M[Refund Payment]
```

## 🔐 Security Features

- **Input Validation**: Comprehensive DTO validation with class-validator
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Structured error responses
- **Rate Limiting**: Redis-based rate limiting (ready to implement)
- **Authentication**: JWT token support (ready to implement)

## 🚀 Production Readiness

### High Availability

- Redis cluster for distributed caching
- Redlock for distributed locking
- Stateless application design

### Scalability

- Modular DDD architecture
- Microservice-ready structure
- Database abstraction layer

### Monitoring

- Comprehensive logging
- Health check endpoints
- Performance metrics (ready to implement)

## 🔄 Development Workflow

### Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(module): add new feature
fix(module): fix bug
docs(module): update documentation
refactor(module): refactor code
test(module): add tests
```

### Code Quality

- ESLint configuration
- Prettier formatting
- Pre-commit hooks
- TypeScript strict mode

## 📈 Future Enhancements

- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] JWT Authentication & Authorization
- [ ] Email notification system
- [ ] SMS notifications
- [ ] Payment gateway integrations
- [ ] Seat map visualization
- [ ] Real-time flight status updates
- [ ] Mobile API optimizations
- [ ] Admin dashboard
- [ ] Reporting and analytics

## 🤝 Đóng Góp (Contributing)

1. Fork repository này
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi của bạn (`git commit -m 'feat(module): add amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Mở Pull Request

### � Quy Tắc Commit

Dự án sử dụng **Conventional Commits**:

```bash
feat(user): add user registration API
fix(booking): resolve duplicate booking issue
docs(readme): update API documentation
refactor(payment): improve service architecture
```

## 🧪 Testing & Quality

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Linting
npm run lint

# Code formatting
npm run format
```

## 🚀 Production Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t flight-booking-api .

# Run with environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e REDIS_HOST=redis-cluster \
  -e DATABASE_URL=postgresql://... \
  flight-booking-api
```

### Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000

# Redis Cluster
REDIS_HOST=localhost
REDIS_PORT=7000

# Database (Future)
DATABASE_URL=postgresql://user:pass@localhost:5432/flight_booking

# JWT Authentication
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# Payment Gateway (Future)
STRIPE_SECRET_KEY=sk_...
PAYPAL_CLIENT_ID=...
```

## 📖 Documentation

### API Documentation

Khi ứng dụng chạy, truy cập:

- **Swagger UI**: http://localhost:3000/api
- **Redoc**: http://localhost:3000/docs

### Architecture Documentation

- **DDD Architecture**: [.github/ddd-architecture.instruction.md](.github/ddd-architecture.instruction.md)
- **API Design**: [.github/api-design.instruction.md](.github/api-design.instruction.md)
- **Database Design**: [.github/database.instruction.md](.github/database.instruction.md)
- **Commit Conventions**: [.github/commit-conventions.md](.github/commit-conventions.md)

## 🔧 Development Tools

```bash
# Generate new module
npm run generate:module <module-name>

# Database migrations (Future)
npm run migration:generate
npm run migration:run

# Seed data
npm run seed
```

## 📊 Monitoring & Observability

### Health Checks

```bash
# Application health
GET /health

# Redis connection
GET /health/redis

# Database connection (Future)
GET /health/database
```

### Metrics & Logging

- **Application Logs**: Structured JSON logging với Winston
- **Performance Metrics**: Built-in NestJS metrics
- **Error Tracking**: Comprehensive error handling và reporting

## 🛡️ Security Features

- ✅ **JWT Authentication** với refresh tokens
- ✅ **Role-based Access Control** (Admin, User)
- ✅ **Rate Limiting** cho API endpoints
- ✅ **Input Validation** với class-validator
- ✅ **CORS Configuration** cho production
- ✅ **Helmet** security headers
- ✅ **Data Sanitization** chống XSS

## 🏗️ Future Roadmap

### Phase 1 - Database Integration

- [ ] PostgreSQL database integration
- [ ] TypeORM migrations và seeding
- [ ] Database repository implementations

### Phase 2 - Payment Integration

- [ ] Stripe payment gateway
- [ ] PayPal integration
- [ ] Webhook handling

### Phase 3 - Advanced Features

- [ ] Real-time notifications với WebSockets
- [ ] Email notification service
- [ ] File upload cho documents
- [ ] Advanced search với Elasticsearch

### Phase 4 - DevOps & Scaling

- [ ] CI/CD pipeline với GitHub Actions
- [ ] Kubernetes deployment
- [ ] Monitoring với Prometheus/Grafana
- [ ] Load testing và performance optimization

## 📄 License

Dự án này được cấp phép theo **MIT License** - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👨‍💻 Author

**CulesBao** - [GitHub Profile](https://github.com/CulesBao)

---

> **Ghi chú**: Đây là dự án demonstration showcase kiến trúc DDD và best practices của NestJS cho việc xây dựng enterprise applications có thể mở rộng.
