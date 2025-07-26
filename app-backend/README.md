# Backend Application - From Monolith to Microservices with Hexagonal Architecture

This backend application demonstrates the power of Hexagonal Architecture during a transition from monolithic to microservices architecture. The project showcases how the core business logic remains unchanged while the delivery and infrastructure mechanisms evolve.

## Architecture Evolution

### Previous Monolithic Structure:
```
app-backend/
├── packages/
    ├── api/          # Monolithic API Layer
    ├── core/         # Domain & Application Layer
    └── db/          # Infrastructure Layer
```

### Current Microservices Structure:
```
app-backend/
├── packages/
    ├── api/          # API Gateway
    ├── auth-service/ # Authentication Service
    ├── user-service/ # User Management Service
    ├── core/         # Domain & Application Layer (Unchanged)
    └── db/          # Infrastructure Layer
```

## The Power of Hexagonal Architecture in the Transition

The key benefit of our hexagonal architecture is demonstrated in this transition: the core business logic remains completely unaware of the architectural change from monolith to microservices.

### Core Architecture Principles

1. **Domain Layer** (`packages/core/src/domains`)
   - Contains the business logic and domain entities
   - Defines interfaces (ports) that remain stable during the transition
   - Completely unaware of whether it's used in a monolith or microservices

2. **Application Layer** (`packages/core/src/application`)
   - Contains use cases that remain identical in both architectures
   - Same business rules work regardless of the delivery mechanism
   - Examples: CreateUser, GetUser, LoginUser work the same way

3. **Service Layer** (New in Microservices)
   - Each service (`auth-service`, `user-service`) implements its specific concerns
   - Services communicate through message queues (RabbitMQ)
   - Core business logic is reused across services

4. **Infrastructure Layer** (`packages/db`)
   - Adapters now implement repository interfaces for each service
   - Database connections are service-specific
   - Demonstrates the flexibility of the ports and adapters pattern

## Adapter Pattern Implementation

The application demonstrates the power of the adapter pattern through its repository implementations:

```typescript
// Interface (Port) definition
interface IUserAccountRepository {
    // Repository methods
}

// Different implementations (Adapters)
- InMemoryAccountRepo
- NoSqlAccountRepo
- SqlLiteAccountRepo
```

### Easy Implementation Swapping

The architecture makes it simple to swap implementations:

```typescript
// In account.controller.ts
const repo: IUserAccountRepository = isTestEnv 
    ? new InMemoryAccountRepo()     // For testing
    : new NoSqlAccountRepo();       // For production
```

Benefits:
- Easy to switch between different database implementations
- Simplified testing with in-memory repositories
- Clean separation between business logic and infrastructure concerns
- New storage implementations can be added without modifying existing code

## Testing

The architecture supports different types of testing:
- Unit tests with in-memory repositories
- Integration tests with real database implementations
- Easy mocking of dependencies

## Current Project Structure

- `api/`: API Gateway for routing requests to appropriate services
- `auth-service/`: Authentication and authorization service
- `user-service/`: User management service
- `core/`: Business logic and use cases (unchanged from monolith)
- `db/`: Repository implementations for services
- `integration-test/`: Integration tests
- `unit-tests/`: Unit tests for use cases

## Service Communication

The transition to microservices introduced:
- RabbitMQ for inter-service communication
- Message queues for asynchronous operations
- Service-specific databases
- API Gateway pattern for client requests

## Getting Started

1. Install dependencies for all services:
   ```bash
   bun install
   ```

2. Start required infrastructure:
   ```bash
   # Start RabbitMQ
   docker-compose up -d rabbitmq
   
   # Start MongoDB
   docker-compose up -d mongodb
   ```

3. Start services (in separate terminals):
   ```bash
   # Start API Gateway
   cd packages/api && bun start
   
   # Start Auth Service
   cd packages/auth-service && bun start
   
   # Start User Service
   cd packages/user-service && bun start
   ```

Note: The application uses Bun as the runtime environment and package manager.
