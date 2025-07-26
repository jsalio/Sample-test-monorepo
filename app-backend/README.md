# Backend Application - Hexagonal Architecture

This backend application is built using Hexagonal Architecture (also known as Ports and Adapters pattern), which provides a clean separation of concerns and makes the application highly maintainable and testable.

## Architecture Overview

The application follows a modular structure with clear boundaries between different layers:

```
app-backend/
├── packages/
    ├── api/          # API Layer (Controllers, Routes)
    ├── core/         # Domain & Application Layer
    └── db/          # Infrastructure Layer (Repositories)
```

### Core Concepts

1. **Domain Layer** (`packages/core/src/domains`)
   - Contains the business logic and domain entities
   - Defines interfaces (ports) for external dependencies
   - Independent of external implementations

2. **Application Layer** (`packages/core/src/application`)
   - Contains use cases (application services)
   - Orchestrates the flow of data and implements business rules
   - Examples: CreateUser, GetUser, LoginUser, etc.

3. **Infrastructure Layer** (`packages/db`)
   - Contains concrete implementations of the interfaces defined in the domain layer
   - Implements repository interfaces for different storage solutions
   - Easy to swap implementations without affecting business logic

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

## Project Structure

- `api/`: REST API endpoints and controllers
- `core/`: Business logic, use cases, and domain entities
- `db/`: Repository implementations for different storage solutions
- `integration-test/`: Integration tests
- `unit-tests/`: Unit tests for use cases

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Run tests:
   ```bash
   bun test
   ```

3. Start the application:
   ```bash
   bun start
   ```

Note: The application uses Bun as the runtime environment and package manager.
