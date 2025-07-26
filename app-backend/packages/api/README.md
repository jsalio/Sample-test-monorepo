# API Package - Monolithic Backend

This package contains the API layer of our monolithic backend application. While structured in packages for better organization, this is a monolithic application where all components run in the same process.

## Architecture Overview

The API package serves as the entry point for our monolithic backend, integrating directly with the `core` and `db` packages:

```
api/
├── src/
│   ├── controller/          # Request handlers and route definitions
│   │   ├── account.controller.ts
│   │   └── auth.controller.ts
│   ├── utils/              # Middleware and utility functions
│   └── index.ts            # Application entry point
```

## Integration with Other Packages

### Core Package Integration
The API directly imports and uses business logic from the `core` package:

```typescript
import { 
    CreateUser, 
    GetAllUsers, 
    IUserAccountRepository 
} from "@app-monorepo/core";
```

- Uses use cases defined in core (e.g., `CreateUser`, `GetUser`)
- Implements request validation using core validators
- Maps HTTP requests to domain operations

### DB Package Integration
Database implementations are imported from the `db` package:

```typescript
import { 
    InMemoryAccountRepo, 
    NoSqlAccountRepo 
} from "@app-monorepo/db";
```

- Instantiates repository implementations
- Can switch between different repository implementations
- Maintains database connections within the same process

## Monolithic Nature

Despite being organized in packages, this is a monolithic application because:

1. **Shared Process**: All packages run in the same process
2. **Direct Imports**: Packages directly import from each other
3. **Shared Resources**: Database connections and other resources are shared
4. **Single Deployment**: All packages are deployed together

### Benefits of this Structure

- **Simplified Development**: Easy to develop and debug
- **Strong Consistency**: Direct method calls between packages
- **Low Latency**: No network overhead between packages
- **Transaction Management**: Easy to maintain data consistency

### Package Dependencies

```json
{
  "dependencies": {
    "@app-monorepo/core": "workspace:*",
    "@app-monorepo/db": "workspace:*"
  }
}
```

## API Routes

The API exposes the following endpoints:

- `POST /api/account/new` - Create new user account
- `GET /api/account/users` - Get all users (protected)
- `GET /api/account/users/:id` - Get specific user (protected)
- `PUT /api/account/update/:id` - Update user (protected)
- `PATCH /api/account/update-password` - Update password (protected)

## Getting Started

Since this is part of a monolithic application, you should run it from the root of the backend:

```bash
# From app-backend directory
bun install
bun start
```

## Development

When making changes, remember that this package:
1. Should only contain HTTP-related logic
2. Should delegate business logic to the core package
3. Should use repositories from the db package
4. Must maintain backward compatibility with existing clients

For more details about the overall architecture, see the [backend documentation](../../README.md).
