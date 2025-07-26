# Full Stack Monorepo with Microservices

This modern full-stack monorepo showcases the evolution from a monolithic to a microservices architecture. It demonstrates how Hexagonal Architecture enables smooth architectural transitions while maintaining business logic integrity. The project combines an Angular frontend with a microservices backend.

## Project Evolution

The project has evolved from a monolithic to a microservices architecture while maintaining the same business capabilities:

```
├── app-backend/      # Microservices Backend
│   └── packages/
│       ├── api/            # API Gateway
│       ├── auth-service/   # Authentication & Authorization
│       ├── user-service/   # User Management
│       ├── core/           # Shared Business Logic & Domain
│       └── db/            # Database Implementations
│
└── app-frontend/    # Angular Frontend
    └── src/
        ├── app/
        │   ├── modules/
        │   │   ├── login/    # Login module
        │   │   └── site/     # Main site module
        │   └── services/     # Angular services
        └── ...
```

## Architecture Overview

### Backend Microservices

The backend has evolved into a microservices architecture while preserving its hexagonal design:

- **API Gateway**: Routes and manages client requests
- **Auth Service**: Handles authentication and authorization
- **User Service**: Manages user operations
- **Shared Core**: Contains business logic used across services

[📚 View Backend Documentation](app-backend/README.md)

Key Features:
- Microservices Architecture
- Clean Hexagonal Architecture in each service
- Message-based service communication (RabbitMQ)
- Independent service scaling
- Built with Bun and TypeScript

### Frontend

The Angular frontend adapts to the microservices backend:
- Centralized API Gateway communication
- User authentication through Auth Service
- User management through User Service
- Responsive design
- Module-based architecture

## Getting Started

1. Start Infrastructure:
   ```bash
   # Start required services
   docker-compose up -d
   ```

2. Install Dependencies:
   ```bash
   # Install backend services dependencies
   cd app-backend
   bun install

   # Install frontend dependencies
   cd ../app-frontend
   npm install
   ```

3. Start Services:
   ```bash
   # Start backend services (from app-backend directory)
   cd packages/api && bun start
   cd packages/auth-service && bun start
   cd packages/user-service && bun start

   # Start frontend (from app-frontend directory)
   ng serve
   ```

## Development

The project leverages:
- Microservices architecture for scalability
- RabbitMQ for service communication
- MongoDB for data persistence
- Bun as the backend runtime
- Angular CLI for frontend
- TypeScript throughout the stack
- Jest for testing

## Testing

```bash
# Run backend tests
cd app-backend
bun test

# Run frontend tests
cd app-frontend
ng test
```

## Architecture Benefits

The current architecture provides:
1. **Scalability**: Each service can scale independently
2. **Resilience**: Services are isolated, preventing cascade failures
3. **Flexibility**: Easy to add or modify services
4. **Maintainability**: Clear separation of concerns
5. **Reusability**: Shared core business logic across services

## Service Communication

- **RabbitMQ**: Message broker for service communication
- **API Gateway**: Single entry point for client requests
- **Event-Driven**: Asynchronous communication between services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
