# API Gateway Service

This package serves as the API Gateway in our microservices architecture. It acts as the main entry point for client applications, handling request routing and communication with other microservices (User Service and Auth Service).

## Architecture Overview

The API Gateway serves as the single entry point for all client requests, routing them to appropriate microservices and handling inter-service communication:

```
api/
├── src/
│   └── index.ts            # Application entry point
```

## Integration with Microservices

### Message Queue Integration
The API Gateway communicates with other services through RabbitMQ:

```typescript
// Example of message queue configuration
const connection = await amqp.connect(RABBITMQ_URL);
const channel = await connection.createChannel();
```

- Routes requests to appropriate service queues
- Handles asynchronous responses
- Manages service communication

### Service Communication
Integrates with:
- **User Service**: Handles user management operations
- **Auth Service**: Manages authentication and authorization

Communication patterns:
1. **Request-Response**: For synchronous operations
2. **Event-Based**: For asynchronous operations
3. **Message Queue**: For reliable message delivery

## Microservice Architecture Benefits

This service gateway provides:

1. **Decoupled Services**: Each service runs independently
2. **Scalability**: Services can be scaled independently
3. **Resilience**: Service isolation prevents cascading failures
4. **Flexibility**: Easy to add or modify services

### Gateway Features

- **Request Routing**: Routes requests to appropriate services
- **Load Balancing**: Distributes load across service instances
- **Authentication**: Validates tokens and handles auth flows
- **Request/Response Transformation**: Adapts data formats as needed
- **Service Discovery**: Manages service endpoints

### Dependencies

```json
{
  "dependencies": {
    "amqplib": "^0.10.8",
    "dotenv": "^17.2.0",
    "jose": "^6.0.12"
  }
}
```

## API Routes

The gateway routes requests to appropriate microservices:

### User Service Routes
- `POST /api/account/new` → User Service
- `GET /api/account/users` → User Service (protected)
- `GET /api/account/users/:id` → User Service (protected)
- `PUT /api/account/update/:id` → User Service (protected)
- `PATCH /api/account/update-password` → User Service (protected)

### Auth Service Routes
- `POST /api/auth/login` → Auth Service
- `POST /api/auth/verify` → Auth Service

## Getting Started

To run the API Gateway:

```bash
# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with your configuration:
# - RABBITMQ_URL
# - AUTH_SERVICE_URL
# - USER_SERVICE_URL
# - PORT

# Start the gateway
bun start
```

## Development

When making changes, remember that this gateway:
1. Should focus on routing and request handling
2. Must handle service communication through message queues
3. Should implement proper error handling and timeouts
4. Must maintain API compatibility for clients
5. Should implement proper logging and monitoring

For more details about the overall architecture, see the [backend documentation](../../README.md).

For more information about microservice [Read this](https://www.paradigmadigital.com/dev/patrones-arquitectura-microservicios-que-son-ventajas/)
